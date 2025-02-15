import { DataGrid } from "devextreme-react";
import { Column, Lookup, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import React from "react";
import { checkAccess } from "../../api/apploan";
import { activityResultStore, activityTypeStore, contactActivityListStore, selectBoxOptions } from "../../api/contact";
import { filterOperation } from "../../constants/FilterOperation";
import moment from "moment-timezone";

interface Iprops {
    contactId: string;
    withTitle?: boolean;
}

interface Istate {
    contactActivities: any[];
    toolbar: any[];
    isCreateVisible: boolean;
    selectedTypeId: string;
    resultOptions: any[];
    contactData: {
        typeId?: string;
        resultId?: string;
        comment?: string;
    };
}

class ContactActivity extends React.PureComponent<Iprops, Istate> {
    private resultDataSource: DataSource;

    constructor(props: Iprops) {
        super(props);

        // Initialize resultDataSource with a custom load function
        this.resultDataSource = new DataSource({
            load: async () => {
                console.log("masuk")
                const typeId = this.state?.selectedTypeId;
                if (!typeId) return [];

                const resultStore = activityResultStore(typeId);
                const ds = new DataSource(resultStore);
                return await ds.load();
            },
            key: 'id'
        });

        this.state = {
            contactActivities: [],
            toolbar: [],
            isCreateVisible: false,
            selectedTypeId: '',
            resultOptions: [],
            contactData: {}
        };
    }

    async componentDidMount() {
        try {
            const typeDataSource = new DataSource(activityTypeStore);
            const typeData = await typeDataSource.load();

            if (typeData.length > 0) {
                const initialTypeId = typeData[0].id;
                const resultOptions = await this.fetchResultOptions(initialTypeId);
                this.setState({
                    selectedTypeId: initialTypeId,
                    resultOptions
                });
            }

            const hasAccess = await checkAccess("800e5c98-4a29-47e1-b1e7-1ff1d5ea0737");
            if (hasAccess) {
                this.setState((prevState) => ({
                    toolbar: [
                        ...prevState.toolbar,
                        {
                            location: "after",
                            widget: "dxButton",
                            options: {
                                text: "Tambahkan Komentar",
                                type: "default",
                                stylingMode: "contained",
                                onClick: this.showFormPopup
                            }
                        }
                    ]
                }));
            }
        } catch (error) {
            console.error("Error fetching activity types:", error);
        }
    }

    showFormPopup = () => {
        this.setState({ isCreateVisible: true, contactData: {} });
    };

    hideFormPopup = () => {
        this.setState({
            isCreateVisible: false,
            contactData: {}
        });
    };

    fetchResultOptions = async (typeId: string) => {
        if (!typeId) return [];
        const resultDataSource = new DataSource(activityResultStore(typeId));
        const resultData = await resultDataSource.load();
        return resultData.map((item: any) => ({
            id: item.id,
            name: item.name
        }));
    };

    handleTypeChange = async (e: any) => {
        const newTypeId = e.value;
        const resultOptions = await this.fetchResultOptions(newTypeId);

        this.setState({
            selectedTypeId: newTypeId,
            resultOptions,
            contactData: {
                typeId: newTypeId,
                resultId: undefined 
            }
        }, () => {
            this.resultDataSource.reload();
        });
    };

    render() {
        let that = this;
        const { selectedTypeId, isCreateVisible, contactData } = this.state;
        const typeOptions = selectBoxOptions(new DataSource(activityTypeStore), "Select Type");
        console.log(that.resultDataSource);

        return (
            <div className={"dx-card responsive-paddings"}>
                {this.props.withTitle && <h5 style={{ margin: 0 }}>Contact Activity</h5>}

                <DataGrid
                    remoteOperations={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    showBorders={true}
                    cacheEnabled={false}
                    dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                    repaintChangesOnly={true}
                    dataSource={new DataSource({
                        store: contactActivityListStore(this.props.contactId),
                        key: 'id'
                    })}
                    onRowInserting={(options: any) => {
                        options.data = {
                            contactId: that.props.contactId,
                            typeId: options.data.typeId || selectedTypeId,
                            comment: options.data.name,
                            resultId: options.data.resultId
                        };
                    }}
                    onRowUpdating={(options: any) => {
                        options.newData = {
                            ...options.oldData,
                            ...options.newData,
                            contactId: that.props.contactId,
                            comment: options.newData.name ? options.newData.name : options.oldData.name
                        };
                    }}

                    editing={{
                        mode: "popup",
                        allowUpdating: (options: any) => {
                            const createdOn = moment(options.row.data.createdOn);
                            const now = moment();
                            const diffInMinutes = now.diff(createdOn, "minutes");
                            return diffInMinutes <= 60;
                        },
                        allowAdding: true,
                        popup: {
                            title: "Activity Form",
                            showTitle: true,
                            width: "40%",
                            height: 360,
                            visible: isCreateVisible,
                            onHiding: this.hideFormPopup,
                        },
                        form: {
                            formData: contactData,
                            colCount: 1,
                            items: [
                                {
                                    dataField: "typeId",
                                    editorType: "dxSelectBox",
                                    editorOptions: {
                                        ...typeOptions,
                                        value: selectedTypeId,
                                        onValueChanged: this.handleTypeChange
                                    },
                                    isRequired: true,
                                },
                                {
                                    dataField: "resultId",
                                    editorType: "dxSelectBox",
                                    editorOptions: {
                                        dataSource: this.resultDataSource,
                                        displayExpr: "name",
                                        valueExpr: "id",
                                        value: contactData.resultId
                                    },
                                    isRequired: true
                                },
                                {
                                    dataField: "name",
                                    editorOptions: {},
                                    isRequired: true,
                                    editorType: "dxTextArea"
                                }
                            ]
                        }
                    }}
                >
                    <Scrolling showScrollbar={"always"} />
                    <Column dataField={"modifiedByName"} caption={"Modified By"} />
                    <Column
                        dataField={"modifiedOn"}
                        caption={"Modified At"}
                        dataType={"date"}
                        format={"dd MMM yyyy HH:mm:ss"}
                        calculateFilterExpression={function (
                            value: any,
                            selectedFilterOperations: any,
                            target: any
                        ) {
                            // @ts-expect-error
                            const column = this as any;
                            // @ts-expect-error
                            return column.defaultCalculateFilterExpression.apply(this, [
                                new Date(value),
                                selectedFilterOperations,
                                target
                            ]);
                        }}
                        filterOperations={filterOperation.date}
                    />
                    <Column dataField={"typeName"} caption={"Activity"} />
                    <Column dataField={"typeId"} caption={"Type"}>
                        <Lookup dataSource={activityTypeStore} displayExpr="name" valueExpr="id" />
                    </Column>
                    <Column dataField={"resultId"} caption={"Result"}>
                        {/* @ts-expect-error */}
                        <Lookup dataSource={that.resultDataSource} displayExpr="name" valueExpr="id" />
                    </Column>
                    <Column dataField={"name"} caption={"Comment"} width={300} />
                    <Paging defaultPageSize={50} />
                    <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
                </DataGrid>
            </div>
        );
    }
}

export default ContactActivity;