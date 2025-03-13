import { DataGrid } from "devextreme-react";
import { Column, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import moment from "moment-timezone";
import React, { RefObject } from "react";
import { activityTypeStore, contactActivityListStore } from "../../api/contact";
import { filterOperation } from "../../constants/FilterOperation";
import ActivityContactForm, { IContactActivity } from "./contact-activity-form";

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
  activityContactData: IContactActivity;
  activityModal: boolean;
  typeData: any[];
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
      selectedTypeId: "",
      resultOptions: [],
      contactData: {},
      activityContactData: { contactId: this.props.contactId },
      activityModal: false,
      typeData: []
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
          typeData: typeData
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
  };

  onCloseActivityForm = () => {
    this.setState({
      activityContactData: {},
      activityModal: false
    });
  };

  onSubmitActivity = (e: any) => {
    this.onCloseActivityForm();
  };

  render() {
    const { typeData, selectedTypeId, activityContactData, activityModal } = this.state;
    let that = this;
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
          dataSource={
            new DataSource({
              store: contactActivityListStore(this.props.contactId),
              key: "id"
            })
          }
          onToolbarPreparing={(e: any) => {
            const items = e.toolbarOptions.items;
            items.unshift({
              location: "after",
              widget: "dxButton",
              options: {
                hint: "Add new",
                icon: "add",
                onClick: function () {
                  that.onShowActivityForm({
                    contactId: that.props.contactId,
                    typeId: selectedTypeId,
                    id: "",
                    comment: "",
                    resultId: "",
                    currentGeoposition: false,
                    ptpAmount: "",
                    ptpDate: "",
                    photo: "",
                    purposeVisitId: "",
                    purposeCallId: "",
                    latitude: "",
                    longitude: "",
                    salesOfferingId: ""
                  });
                }
              }
            });
          }}
          editing={{
            allowUpdating: (options: any) => {
              let found = typeData.some((x) => x.id === options.row.data.typeId);
              const createdOn = moment(options.row.data.createdOn);
              const now = moment();
              const diffInMinutes = now.diff(createdOn, "minutes");
              return found && diffInMinutes <= 60;
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
            calculateFilterExpression={(value: any, selectedFilterOperations: any, target: any) => {
              const column = this as any;
              return column.defaultCalculateFilterExpression.apply(this, [
                new Date(value),
                selectedFilterOperations,
                target
              ]);
            }}
            filterOperations={filterOperation.date}
          />
          <Column dataField={"typeName"} caption={"Type"} />
          <Column dataField={"resultName"} caption={"Result"} />
          <Column dataField={"name"} caption={"Comment"} width={300} />
          <Column
            type={"buttons"}
            buttons={[
              {
                name: "edit",
                onClick: function (e: any) {
                  that.onShowActivityForm({
                    id: e.row.data.id,
                    contactId: e.row.data.contactId || "",
                    resultId: e.row.data.resultId || "",
                    typeId: e.row.data.typeId || "",
                    comment: e.row.data.name || "",
                    photo: "",
                    image: `${process.env.REACT_APP_BACKEND}/api/file/get${e.row.data.photo}` || "",
                    currentGeoposition: e.row.data.latitude !== "" && e.row.data.longitude !== "",
                    latitude: e.row.data.latitude || "",
                    longitude: e.row.data.longitude || "",
                    ptpDate: e.row.data.ptpDate || "",
                    ptpAmount: e.row.data.ptpAmount || "",
                    purposeVisitId: e.row.data.purposeVisitId || "",
                    purposeCallId: e.row.data.purposeCallId || "",
                    salesOfferingId: e.row.data.salesOfferingId || ""
                  });
                  e.event.preventDefault();
                }
              }
            ]}
          ></Column>
          <Paging defaultPageSize={50} />
          <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
        </DataGrid>
        <ActivityContactForm
          activityContactData={activityContactData}
          isModalVisible={activityModal}
          onSubmit={this.onSubmitActivity}
          onCloseModal={that.onCloseActivityForm}
        />
      </div>
    );
  }
}

export default ContactActivity;
