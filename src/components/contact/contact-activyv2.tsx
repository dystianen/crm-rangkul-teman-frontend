import { DataGrid } from "devextreme-react";
import { Column, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import moment from "moment-timezone";
import React, {RefObject, useRef, useState} from "react";
import { contactActivityListStore } from "../../api/contact";
import { filterOperation } from "../../constants/FilterOperation";
import ActivityContactForm, { IContactActivity } from "./contact-activity-form";
import {backofficeAccess} from "../../constants/variableConstata";
import {useAuth} from "../../contexts/auth";

interface Iprops {
  contactId: string;
  withTitle?: boolean;
}


export default function ContactActivityV2(props: Iprops) {
  const {user} = useAuth();
  const typeGridRef = useRef<DataGrid>(null);
  
  const [activityContactData, setActivityContactData] = useState({});
  const [activityModal, setActivityModal] = useState(false);
  
  
  const onShowActivityForm = (formData: IContactActivity) => {
	setActivityModal(true);
	setActivityContactData(formData);
  };
  
  const onCloseActivityForm = () => {
	setActivityModal(false);
	setActivityContactData({});
  };
  
  const onSubmitActivity = (e: any) => {
	onCloseActivityForm();
	const typeGrid = typeGridRef.current!.instance;
	typeGrid.refresh(true).then(console.log);
  };
  
  
  
  return <div className={"dx-card responsive-paddings"}>
	{props.withTitle && <h5 style={{margin: 0}}>Contact Activity</h5>}
	
	
	<DataGrid
		ref={typeGridRef}
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
			store: contactActivityListStore(props.contactId),
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
			  onClick: (evt: any) => {
				setActivityModal(true);
				evt.event.preventDefault();
			  }
			}
		  });
		}}
		editing={{
		  allowUpdating: (options: any) => {
			let found = (typeof user?.userAccess !== "undefined") && user?.userAccess.some((access: string) => access === backofficeAccess.backoffice_contact_activity_type_collection || access === backofficeAccess.backoffice_contact_activity_type_sales);
			
			const createdOn = moment(options.row.data.createdOn);
			const now = moment();
			const diffInMinutes = now.diff(createdOn, "minutes");
			return found && diffInMinutes <= 60;
		  }
		}}
	>
	  <Scrolling showScrollbar={"always"}/>
	  <Column dataField={"modifiedByName"} caption={"Modified By"}/>
	  <Column
		  dataField={"modifiedOn"}
		  caption={"Modified At"}
		  dataType={"date"}
		  format={"dd MMM yyyy HH:mm:ss"}
		  calculateFilterExpression={(value: any, selectedFilterOperations: any, target: any) => {
			const grid = typeGridRef.current!.instance;
			const columns = grid.getVisibleColumns();
			const column:any = columns.find((col: any) => col.dataField === 'modifiedOn');
			return column.defaultCalculateFilterExpression.apply(column, [
			  new Date(value),
			  selectedFilterOperations,
			  target
			]);
		  }}
		  filterOperations={filterOperation.date}
	  />
	  <Column dataField={"categoryName"} caption={"Category"}/>
	  <Column dataField={"typeName"} caption={"Type"}/>
	  <Column dataField={"resultName"} caption={"Result"}/>
	  <Column dataField={"name"} caption={"Comment"} width={300}/>
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
				  image: e.row.data.photo || "",
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
				onShowActivityForm(dataRec);
				e.event.preventDefault();
			  }
			}
		  ]}
	  ></Column>
	  <Paging defaultPageSize={50}/>
	  <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]}/>
	</DataGrid>
	<ActivityContactForm
		contactId={props.contactId}
		activityContactData={activityContactData}
		isModalVisible={activityModal}
		onSubmit={onSubmitActivity}
		onCloseModal={onCloseActivityForm}
	/>
  </div>
}
