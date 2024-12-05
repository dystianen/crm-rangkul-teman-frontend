import React from "react";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {DataGrid} from "devextreme-react";
import {filterOperation} from "../../constants/FilterOperation";
import {checkAccess} from "../../api/apploan";
import {contactActivityListStore} from "../../api/contact";

interface Iprops<T> {
    contactId: string;
}

interface Istate<T> {
    contactActivities: any[];
    toolbar: any[];
    isCreateVisible: boolean;
}

class ContactActivity<T> extends React.PureComponent<Iprops<T>, Istate<T>> {
    constructor(props: Iprops<T>) {
        super(props);
        this.state = {
            contactActivities: [],
            toolbar: [],
            isCreateVisible: false,
        }
    }

    componentDidMount() {
        let that = this;
        checkAccess('800e5c98-4a29-47e1-b1e7-1ff1d5ea0737').then((res) => {
            if (res) {
                that.state.toolbar.push({
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        text: "Tambahkan Komentar",
                        type: "default",
                        stylingMode: "contained",
                        onClick: that.showFormPopup
                    },
                });
            }
        });
    }

    showFormPopup = () => {
        this.setState({isCreateVisible: true});
    }

    hideFormPopup = () => {
        this.setState({isCreateVisible: false});
    }

    onToolbarPreparing = (e: any, visible: boolean) => {
        const items = e.toolbarOptions.items;
        console.log("items toolbar preparing", items);
    }

    render() {
        return <>
            <DataGrid
                dataSource={contactActivityListStore}
                // focusedRowEnabled={true}
                remoteOperations={true}
                columnAutoWidth={true}
                wordWrapEnabled={false}
                showBorders={true}
                dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                repaintChangesOnly={true}
                toolbar={this.state.toolbar as any}
            >
                <Scrolling showScrollbar={"always"}/>
                <Column dataField={"createdByName"} caption={"Created By"}/>
                <Column dataField={"createdOn"} caption={"Created At"}
                        dataType={"date"}
                        format={"dd MMM yyyy HH:mm:ss"}
                        calculateFilterExpression={function (
                            value: any,
                            selectedFilterOperations: any,
                            target: any
                        ) {
                            const column = this as any;
                            return column.defaultCalculateFilterExpression.apply(this, [
                                new Date(value),
                                selectedFilterOperations,
                                target,
                            ]);
                        }}
                        filterOperations={filterOperation.date}/>
                <Column dataField={"modifiedByName"} caption={"Modified By"}/>
                <Column dataField={"modifiedOn"} caption={"Modified At"}
                        dataType={"date"}
                        format={"dd MMM yyyy HH:mm:ss"}
                        calculateFilterExpression={function (
                            value: any,
                            selectedFilterOperations: any,
                            target: any
                        ) {
                            const column = this as any;
                            return column.defaultCalculateFilterExpression.apply(this, [
                                new Date(value),
                                selectedFilterOperations,
                                target,
                            ]);
                        }}
                        filterOperations={filterOperation.date}/>
                <Column dataField={"typeName"} caption={"Activity"}/>
                <Column dataField={"resultName"} caption={"Result"}/>
                <Column dataField={"name"} caption={"Comment"}/>
                <Paging defaultPageSize={50}/>
                <Pager
                    showPageSizeSelector={true}
                    showInfo={true}
                    allowedPageSizes={[10, 50, 100]}
                />
            </DataGrid>
        </>;
    }
}

export default ContactActivity;