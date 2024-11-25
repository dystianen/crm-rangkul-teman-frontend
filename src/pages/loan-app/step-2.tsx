import React, {useEffect, useRef, useState} from "react";
import Form, {
    ButtonItem,
    GroupItem,
    RequiredRule,
    SimpleItem,
} from "devextreme-react/form";

import "devextreme-react/file-uploader";
import "./loan-app.scss";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import "devextreme-react/date-box";
import {Button, LoadPanel} from "devextreme-react";
import DataGrid, {
    Column,
    FilterRow,
    Item,
    Pager,
    Paging,
    Scrolling,
    Toolbar,
    Editing,
    Popup as PopGrid,
    Form as FormGrid,
} from "devextreme-react/data-grid";
import {AppLoanRequest} from "src/interfaces/appLoanOnboarding";
import {createAppLoanOnboardingStep2, detailAppLoan} from "src/api/apploan";
import notify from "devextreme/ui/notify";
import PdfViewer from "src/components/pdf-viewer/PdfViewer";
import {getFileBase64} from "../../api/helper";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../components/alink";
import Resizer from "react-image-file-resizer";

export default function Step2Page() {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [incomeProof, setIncomeProof] = useState<any>(undefined);
    const [fileType, setFileType] = useState<string>("");
    const [dataGrid, setDataGrid] = useState<any[]>([]);
    const formRef = useRef<Form>(null);
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        detailAppLoan(String(id)).then((res) => {
            const data = res as AppLoanRequest;
            const gridStore: any[] = data?.customData || [];
            setDataGrid(gridStore);
            if (data?.incomeProof) {
                setFileType(data.incomeProof.fileType);
                setIncomeProof(getFileBase64(
                    data.incomeProof.fileType,
                    data.incomeProof.fileContent
                ));
            }
        });
    }, [id]);

    const handleSubmit = (e: any) => {
        setSubmitForm(true);
        const form = formRef.current!.instance;
        const customData = dataGrid.length > 0 ? dataGrid.map((m) => {
            return {
                name: m.name,
                value: m.value
            }
        }) : [];
        createAppLoanOnboardingStep2(String(id), {
            customData: customData,
            incomeProof: incomeProof ? incomeProof.split(",")[1] : null,
        }).then((res) => {
                setIncomeProof("");
                setDataGrid([]);
                form.resetValues();
                navigate(`/loan-app/create/preview?id=${id}`);
            }, (error) => {
                setSubmitForm(false);
                notify(
                    {
                        message: error,
                        position: {
                            my: "center top",
                            at: "center top",
                        },
                    },
                    "error",
                    3000
                );
            }
        );
        e.preventDefault();
    };

    const onFileChanged = (e: any) => {
        if (e.value.length > 0) {
            try {
                setFileType(e.value[0].type);
                if (fileType.includes("image/")) {
                    Resizer.imageFileResizer(
                        e.value[0],
                        1772,
                        1181,
                        "JPEG",
                        100,
                        0,
                        (uri) => {
                            setIncomeProof(uri);
                        },
                        "base64",
                        900,
                        400
                    );
                } else {
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                        setIncomeProof(fileReader.result);
                    };
                    fileReader.readAsDataURL(e.value[0]);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const uploadKtpOptions = {
        selectButtonText: "Pilih file",
        accept: "application/pdf,image/*",
        uploadMode: "useForm",
        onValueChanged: onFileChanged,
    };

    return (<>
        <LoadPanel
            shadingColor="rgba(0,0,0,0.4)"
            visible={submitForm}
            showIndicator={true}
            shading={true}
            showPane={true}
            hideOnOutsideClick={false}
        />
        <h2 className={"content-block"}>Step 2</h2>
        <div className={"content-block"}>
            <div className={"dx-card responsive-paddings"}>
                <h3>Custom Data</h3>
                <DataGrid
                    dataSource={dataGrid}
                    columnAutoWidth={true}
                    wordWrapEnabled={false}
                    showBorders={true}
                    dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                    repaintChangesOnly={true}
                >
                    <Editing
                        mode="popup"
                        allowUpdating={true}
                        allowAdding={true}
                        allowDeleting={true}>
                        <PopGrid title="Custom Data Form"
                                 showTitle={true} width={360}
                                 height={320}/>
                        <FormGrid showColonAfterLabel={true}
                                  showValidationSummary={true}
                                  validationGroup="customedata" colCount={1}>
                            <Item dataField="name">
                                <RequiredRule message="Nama wajib diisi"/>
                            </Item>
                            <Item dataField="value">
                                <RequiredRule message="Value wajib diisi"/>
                            </Item>
                        </FormGrid>
                    </Editing>
                    <Column caption={"No."} width={70}
                            alignment={"center"}
                            cellTemplate={function (container: any, options: any) {
                                const dom = ReactDOM.createRoot(container);
                                dom.render(options.rowIndex + 1);
                            }}
                    />
                    <Column dataField={"name"} caption={"Name"}/>
                    <Column dataField={"value"} caption={"Value"}/>
                    <Paging defaultPageSize={50}/>
                    <Pager
                        showPageSizeSelector={true}
                        showInfo={true}
                        allowedPageSizes={[10, 50, 100]}
                    />
                </DataGrid>
            </div>

            <form action="validate" onSubmit={handleSubmit}>
                <Form
                    ref={formRef}
                    colCount={1}
                    id="form"
                    showColonAfterLabel={true}
                    validationGroup="incomeProofData"
                >
                    <GroupItem colSpan={1} cssClass={"dx-card responsive-paddings next-card"}>
                        <GroupItem caption="Income Proof" colCount={1}>
                            <SimpleItem
                                dataField="incomeProof"
                                editorType="dxFileUploader"
                                editorOptions={uploadKtpOptions}
                                label={{text: "File"}}
                            >
                                {/*<RequiredRule message="Income Proof wajib diisi"/>*/}
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem>
                            {incomeProof && (
                                <Item>
                                    {fileType.includes("image/") ? <img
                                            id="dropzone-ktp"
                                            src={incomeProof}
                                            alt="ktp"
                                            width={"50%"}
                                        /> :
                                        <PdfViewer url={incomeProof}/>
                                    }
                                </Item>
                            )}
                        </GroupItem>
                    </GroupItem>
                    <GroupItem colSpan={2}>
                        <GroupItem colCount={2}>
                            <ButtonItem
                                horizontalAlignment="left"
                                buttonOptions={{
                                    text: "Kembali",
                                    type: "normal",
                                    onClick: () => {
                                        navigate(`/loan-app/create/step/1?id=${id}`);
                                    },
                                }}
                            />
                            <ButtonItem
                                horizontalAlignment="right"
                                buttonOptions={{
                                    text: "Lanjutkan",
                                    type: "default",
                                    useSubmitBehavior: true,
                                }}
                            />
                        </GroupItem>
                    </GroupItem>
                </Form>
            </form>
        </div>
    </>);
}
