import { DataGrid, Form } from "devextreme-react";
import { Column, Lookup, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import React from "react";
import { checkAccess } from "../../api/apploan";
import { activityResultStore, activityTypeStore, contactActivityListStore, selectBoxOptions } from "../../api/contact";
import { filterOperation } from "../../constants/FilterOperation";
import moment from "moment-timezone";
import { Item } from 'devextreme-react/form';

interface Iprops {
    contactId: string;
    withTitle?: boolean;
}

interface Istate {
    contactActivities: any[];
    toolbar: any[];
    isCreateVisible: boolean;
    selectedTypeId: string;
    resultOptions: {};
    contactData: {};
}

class ContactActivity extends React.PureComponent<Iprops, Istate> {
    constructor(props: Iprops) {
        super(props);
        this.state = {
            contactActivities: [],
            toolbar: [],
            isCreateVisible: false,
            selectedTypeId: '', // Default kosong
            resultOptions: { }, // Inisialisasi dengan struktur yang benar.
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
        this.setState({ isCreateVisible: true });
    };

    hideFormPopup = () => {
        this.setState({ isCreateVisible: false });
    };

    fetchResultOptions = async (typeId: string) => {
        const resultDataSource = new DataSource(activityResultStore(typeId));
        return selectBoxOptions(resultDataSource, "Select Result");
    };

    handleTypeChange = async (e: any) => {
        const newTypeId = e.value;
        console.log("🚀 ~ ContactActivity ~ handleTypeChange= ~ newTypeId:", newTypeId)
        const resultOptions = await this.fetchResultOptions(newTypeId);
        this.setState({ 
            selectedTypeId: newTypeId,
            resultOptions,
            contactData: { 
                ...this.state.contactData,
                typeId: newTypeId
            }
        });
    };

    onFieldDataChanged = async (evt: any) => {
        const { dataField, value } = evt;
        console.log("🚀 ~ ContactActivity ~ onFieldDataChanged= ~ dataField:", dataField, value);

        if (dataField === "typeId" && value != null) {
            const resultOptions = await this.fetchResultOptions(value);
            this.setState({ 
                selectedTypeId: value,
                resultOptions 
            });
        }

        this.setState(prevState => ({
            contactData: { 
                ...prevState.contactData,
                [dataField]: value
            }
        }));
    };

    onEditorChannelPreparing = (e: any) => {
        console.log("e.dataField: ", e.dataField);
        let that = e;
        if (e.parentType === 'dataRow' && e.dataField === 'typeId') {
          e.editorOptions.onValueChanged = async function (arg: any) {
            e.setValue(arg.value);
            e.component.cellValue(e.row.rowIndex, 'typeId', arg.value);
            console.log('channel ', arg.value);

              that.editorType = 'dxSelectBox';
              that.editorOptions = {
                dataSource: new DataSource(activityResultStore(arg.value)),
                placeholder: 'Choose Result',
                showClearButton: true,
                displayExpr: 'name',
                valueExpr: 'id',
                valueChangeEvent: 'keyup',
                onValueChanged: function (arg2: any) {
                    that.setValue(arg2.value);
                }
              }
            // const resultOptions = await that.fetchResultOptions(arg.value);
            // that.setState({ 
            //     selectedTypeId: arg.value,
            //     resultOptions 
            // });
          };
        }

        if (e.dataField === 'resultId' && e.parentType === 'dataRow') {
            console.log('resultId ', e.row.data.typeId);
            // if (
            //   e.row.data &&
            //   e.row.data.typeId !== null
            // ) {
            //     console.log(e.row)
            //   const contentVal = e.row.data.resultId;
            //   console.log("🚀 ~ ContactActivity ~ contentVal:", contentVal)
      
            //   e.editorType = 'dxSelectBox';
            //   e.editorOptions = {
            //     dataSource: new DataSource(activityResultStore(e.row.data.typeId)),
            //     placeholder: 'Choose Result',
            //     showClearButton: true,
            //     displayExpr: 'name',
            //     valueExpr: 'id',
            //     valueChangeEvent: 'keyup',
            //     value: contentVal ? contentVal.replaceAll('"', '') : '',
            //     onValueChanged: function (arg: any) {
            //       e.setValue(arg.value);
            //     }
            //   }
            
            // }
        }
    }

    render() {
        const { selectedTypeId, isCreateVisible, resultOptions, contactData } = this.state;
        console.log("🚀 ~ ContactActivity ~ render ~ contactData:", contactData)
        const typeOptions = selectBoxOptions(new DataSource(activityTypeStore), "Select Type");

        return (
            <div className={"dx-card responsive-paddings"}>
                {this.props.withTitle && <h5 style={{ margin: 0 }}>Contact Activity</h5>}

                <DataGrid
                    dataSource={contactActivityListStore(this.props.contactId)}
                    remoteOperations={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    showBorders={true}
                    cacheEnabled={false}
                    dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                    repaintChangesOnly={true}
                    onRowInserting={(options: any) => {
                        options.data = {
                            contactId: this.props.contactId,
                            comment: options.data.name,
                            typeId: options.data.typeId || selectedTypeId,
                            resultId: options.data.resultId
                        };
                    }}
                    onRowUpdating={(options: any) => {
                        options.newData = {
                            ...options.oldData,
                            ...options.newData,
                            contactId: this.props.contactId,
                            comment: options.newData.name ? options.newData.name : options.oldData.name
                        };
                    }}
                    onEditorPreparing={this.onEditorChannelPreparing.bind(
                        this,
                      )}
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
                            onHiding: this.hideFormPopup
                        },
                        form: {
                            colCount: 1,
                            formData: contactData,
                            onFieldDataChanged: this.onFieldDataChanged.bind(this),
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
                                    editorOptions: resultOptions,
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
                            const column = this as any;
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
                        <Lookup dataSource={resultOptions} displayExpr="name" valueExpr="id" />
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