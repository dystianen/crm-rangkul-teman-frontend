import {DataGrid} from "devextreme-react";
import {Column, Lookup, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import React, {RefObject} from "react";
import {activityResultStore, activityTypeStore, contactActivityListStore, selectBoxOptions} from "../../api/contact";
import {filterOperation} from "../../constants/FilterOperation";
import moment from "moment-timezone";

import type dxDataGrid from 'devextreme/ui/data_grid';
import ActivityContactForm, {IContactActivity} from "./contact-activity-form";

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
    resultDataSource?: DataSource;
    activityContactData: IContactActivity,
    activityModal: boolean,
}

class ContactActivity extends React.PureComponent<Iprops, Istate> {
    typeGridRef: RefObject<DataGrid>;

    constructor(props: Iprops) {
        super(props);
        this.typeGridRef = React.createRef();

        this.state = {
            contactActivities: [],
            toolbar: [],
            isCreateVisible: false,
            selectedTypeId: '',
            resultOptions: [],
            contactData: {},
            activityContactData: {contactId: this.props.contactId},
            activityModal: false
        };
    }

    get typeGrid(): dxDataGrid {
        return this.typeGridRef.current?.instance!;
    }

    async componentDidMount() {
        try {
            const typeDataSource = new DataSource(activityTypeStore);
            const typeData = await typeDataSource.load();

            if (typeData.length > 0) {
                const initialTypeId = typeData[0].id;
                this.setState({
                    selectedTypeId: initialTypeId,
                });
            }
        } catch (error) {
            console.error("Error fetching activity types:", error);
        }
    }

    onShowActivityForm = (formData: IContactActivity) => {
        this.setState({
            activityContactData: formData,
            activityModal: true
        });
    }

    onCloseActivityForm = () => {
        this.setState({
            activityContactData: {},
            activityModal: false
        });
    }

    onSubmitActivity = (e: any) => {
        console.log("onSubmitActivity ", e);
        this.onCloseActivityForm();
    }

    render() {
        const {selectedTypeId, activityContactData, activityModal} = this.state;
        let that = this;
        return (
            <div className={"dx-card responsive-paddings"}>
                {this.props.withTitle && <h5 style={{margin: 0}}>Contact Activity</h5>}

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

                    onToolbarPreparing={(e: any) => {
                        const items = e.toolbarOptions.items;
                        items.unshift({
                            location: 'after',
                            widget: 'dxButton',
                            options: {
                                hint: 'Add new',
                                icon: 'add',
                                onClick: function (e: any) {
                                    that.onShowActivityForm({
                                        contactId: that.props.contactId,
                                        typeId: selectedTypeId,
                                        resultId: "",
                                        comment: ""
                                    });
                                },
                            },
                        });
                    }}

                    editing={{
                        allowUpdating: (options: any) => {
                            const createdOn = moment(options.row.data.createdOn);
                            const now = moment();
                            const diffInMinutes = now.diff(createdOn, "minutes");
                            return diffInMinutes <= 60;
                        },
                    }}
                >
                    <Scrolling showScrollbar={"always"}/>
                    <Column dataField={"modifiedByName"} caption={"Modified By"}/>
                    <Column
                        dataField={"modifiedOn"}
                        caption={"Modified At"}
                        dataType={"date"}
                        format={"dd MMM yyyy HH:mm:ss"}
                        calculateFilterExpression={(
                            value: any,
                            selectedFilterOperations: any,
                            target: any
                        ) => {
                            const column = this as any;
                            return column.defaultCalculateFilterExpression.apply(this, [
                                new Date(value),
                                selectedFilterOperations,
                                target
                            ]);
                        }}
                        filterOperations={filterOperation.date}
                    />
                    <Column dataField={"typeName"} caption={"Activity"}/>
                    <Column dataField={"typeId"} caption={"Type"}>
                        <Lookup dataSource={activityTypeStore} displayExpr="name" valueExpr="id"/>
                    </Column>
                    <Column dataField={"resultId"} caption={"Result"}>
                        <Lookup dataSource={activityResultStore(null)} displayExpr="name" valueExpr="id"/>
                    </Column>
                    <Column dataField={"name"} caption={"Comment"} width={300}/>
                    <Column type={"buttons"} buttons={[
                        {
                            name: 'edit',
                            onClick: function (e: any) {
                                that.onShowActivityForm({
                                    ...e.row.data,
                                    comment: e.row.data.name
                                });
                                e.event.preventDefault();
                            },
                        },
                    ]}></Column>
                    <Paging defaultPageSize={50}/>
                    <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]}/>
                </DataGrid>
                <ActivityContactForm activityContactData={activityContactData} isModalVisible={activityModal}
                                     onSubmit={this.onSubmitActivity} onCloseModal={that.onCloseActivityForm}/>
            </div>
        );
    }
}

export default ContactActivity;