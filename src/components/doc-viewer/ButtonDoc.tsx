import React from 'react';
import {getFile} from "../../api/apploan";
import {Popup, Position, ToolbarItem} from 'devextreme-react/popup';
import PdfViewer from "../pdf-viewer/PdfViewer";
import "./doc-viewer.less";
import {Button} from "devextreme-react/button";
import {OnClickLink} from "../alink";

interface IProps<T> {
    fileName: string;
    fileUrl: string;
}

interface IState<T> {
    mimetype: string;
    doc: any;
    isModalVisible: boolean;
    dataFile: any;
}

class ButtonDoc<T> extends React.PureComponent<IProps<T>, IState<T>> {
    constructor(props: IProps<T>) {
        super(props);
        this.state = {
            mimetype: "",
            doc: null,
            isModalVisible: false,
            dataFile: null,
        };
    }

    readPdf() {
        const that = this;
        const {fileName, fileUrl} = this.props;
        getFile(fileUrl, {responseType: "blob"})
            .then(function (response) {
                const fileUrl = URL.createObjectURL(response);
                console.log(response);
                if (response.type == "application/pdf") {
                    that.setState({
                        mimetype: response.type,
                        isModalVisible: true,
                        doc: (<PdfViewer url={fileUrl}/>),
                    });
                } else {
                    that.setState({
                        mimetype: response.type,
                        isModalVisible: true,
                        doc: fileUrl,
                    });
                }
            })
            .catch(console.error);
    }

    componentDidMount() {
    }

    showModal = () => {
        this.readPdf();
    };

    render() {
        let that = this;
        const {doc, isModalVisible, mimetype} = this.state;
        const {fileName, fileUrl} = this.props;
        return (<div>
            <OnClickLink onClick={this.showModal.bind(this)}>{fileName}</OnClickLink>
            <Popup
                visible={isModalVisible}
                dragEnabled={false}
                hideOnOutsideClick={true}
                showCloseButton={true}
                showTitle={true}
                title="Preview"
                container=".dx-viewport"
                width={"60%"}
                height={"80vh"}
                onHiding={() => {
                    that.setState({
                        isModalVisible: false,
                    });
                }}
            >
                <div className="PdfViewer">
                    <div className="PdfViewer__container">
                        <div className="PdfViewer__container__document">
                            <Button
                                icon={"download"}
                                text={"Simpan Dokumen"}
                                onClick={() => {
                                    getFile(fileUrl, {responseType: "blob"})
                                        .then(function (response) {
                                            const link = document.createElement("a");
                                            link.href = window.URL.createObjectURL(response);
                                            link.download = fileName;
                                            link.click();
                                        })
                                        .catch(console.error)
                                }}
                            />
                            {(mimetype == "application/pdf") && doc}
                            {mimetype.includes("image/") && (<img src={doc} style={{
                                display: "block",
                                boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
                                margin: "1em auto"
                            }}/>)}
                        </div>
                    </div>
                </div>
            </Popup>
        </div>);
    }
}

export default ButtonDoc;
