import { DataGrid } from "devextreme-react";
import { Column, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import moment from "moment-timezone";
import React, { RefObject } from "react";
import { contactActivityListStore } from "../../api/contact";
import { filterOperation } from "../../constants/FilterOperation";
import ActivityContactForm, { IContactActivity } from "./contact-activity-form";
import {backofficeAccess} from "../../constants/variableConstata";

interface Iprops {
  contactId: string;
  withTitle?: boolean;
  user: any;
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
  user: any;
}

class ContactActivity extends React.PureComponent<Iprops, Istate> {
  private typeGridRef: RefObject<DataGrid>;
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
      user: props.user
    };
  }

  get typeGrid(): dxDataGrid {
    const instance = this.typeGridRef.current?.instance!;
    return instance;
  }

  async componentDidMount() {
  
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
    this.typeGrid.refresh(true);
  };

  render() {
    const {user, activityContactData, activityModal } = this.state;
    let that = this;
    return (
      <div className={"dx-card responsive-paddings"}>
        {this.props.withTitle && <h5 style={{ margin: 0 }}>Contact Activity</h5>}

        <DataGrid
            ref={this.typeGridRef}
          remoteOperations={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          focusedRowEnabled={true}
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
                    categoryId: undefined,
                    typeId: undefined,
                    id: "",
                    comment: "",
                    resultId: "",
                    currentGeoposition: false,
                    ptpAmount: "",
                    ptpDate: "",
                    photo: "",
                    image: "",
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
              let found = (typeof user?.userAccess !== "undefined") && user?.userAccess.some((access:string) => access === backofficeAccess.backoffice_contact_activity_type_collection || access === backofficeAccess.backoffice_contact_activity_type_sales);
              
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
          <Column dataField={"categoryName"} caption={"Category"} />
          <Column dataField={"typeName"} caption={"Type"} />
          <Column dataField={"resultName"} caption={"Result"} />
          <Column dataField={"name"} caption={"Comment"} width={300} />
          <Column
            type={"buttons"}
            buttons={[
              {
                name: "edit",
                onClick: function (e: any) {
                  const dataRec = {
                    id: e.row.data.id,
                    contactId: e.row.data.contactId || "",
                    resultId: e.row.data.resultId || "",
                    categoryId: e.row.data.categoryId || "",
                    typeId: e.row.data.typeId || "",
                    comment: e.row.data.name || "",
                    photo: "",
                    image: ((e.row.data.photo != null && e.row.data.photo.length > 0) ? `${process.env.REACT_APP_BACKEND}api/file/get${e.row.data.photo}`: ""),
                    currentGeoposition: e.row.data.latitude !== "" && e.row.data.longitude !== "",
                    latitude: e.row.data.latitude || "",
                    longitude: e.row.data.longitude || "",
                    ptpDate: e.row.data.ptpDate || "",
                    ptpAmount: e.row.data.ptpAmount || "",
                    purposeVisitId: e.row.data.purposeVisitId || "",
                    purposeCallId: e.row.data.purposeCallId || "",
                    salesOfferingId: e.row.data.salesOfferingId || ""
                  };
                  console.log("data yg mau diubah", dataRec);
                  that.onShowActivityForm(dataRec);
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
