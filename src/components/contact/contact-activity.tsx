import React from "react";
import {Column, Lookup, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {DataGrid} from "devextreme-react";
import {filterOperation} from "../../constants/FilterOperation";
import {checkAccess} from "../../api/apploan";
import {activityResultStore, contactActivityListStore, contactRelativeStore, selectBoxOptions} from "../../api/contact";
import DataSource from "devextreme/data/data_source";

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

    onToolbarPreparing = (e: any) => {
        const items = e.toolbarOptions.items;
        console.log("items toolbar preparing", e.data);
    }

    render() {
        let that = this;
        const resultOptions = selectBoxOptions(
            new DataSource(activityResultStore),
            "Select Result"
        );

        return <div className={"dx-card responsive-paddings"}>
            <DataGrid
                dataSource={contactActivityListStore(this.props.contactId)}
                // focusedRowEnabled={true}
                remoteOperations={true}
                columnAutoWidth={true}
                wordWrapEnabled={false}
                showBorders={true}
                dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                repaintChangesOnly={true}
                onRowInserting={(options: any) => {
                    options.data = {
                        contactId: that.props.contactId,
                        comment: options.data.name,
                        resultId: options.data.resultId,
                    };
                }}
                onRowUpdating={(options: any) => {
                    options.newData = { ...options.oldData, ...options.newData,
                        contactId: that.props.contactId,
                        comment: options.newData.name ? options.newData.name : options.oldData.name,
                    };
                }}
                onToolbarPreparing={that.onToolbarPreparing}
                editing={{
                    mode: "popup",
                    allowUpdating: true,
                    allowAdding: true,
                    popup: {
                        title: "Relative Contact",
                        showTitle: true,
                        width: "40%",
                        height: 360
                    },
                    form: {
                        colCount: 1,
                        items: [
                            {
                                label: {text: "Result"},
                                dataField: "resultId",
                                editorType: "dxSelectBox",
                                editorOptions: resultOptions,
                                isRequired: true,
                            },
                            {
                                label: {text: "Comment"},
                                dataField: "name",
                                editorOptions: {},
                                isRequired: true,
                                editorType: "dxTextArea"
                            }
                        ]
                    }
                }}
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
                <Column dataField={"resultId"} caption={"Result"}>
                    <Lookup dataSource={activityResultStore} displayExpr="name" valueExpr="id"/>
                </Column>
                <Column dataField={"name"} caption={"Comment"}/>
                <Paging defaultPageSize={50}/>
                <Pager
                    showPageSizeSelector={true}
                    showInfo={true}
                    allowedPageSizes={[10, 50, 100]}
                />
            </DataGrid>
        </div>;
    }
}

export default ContactActivity;
