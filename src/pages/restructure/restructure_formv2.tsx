import Form, {CustomRule, GroupItem, PatternRule, SimpleItem} from "devextreme-react/form";
import {formatRupiah} from "../../utils/string.util";
import {formatOnlyDateMonthYear} from "../../utils/dateUtils";
import {DataGrid} from "devextreme-react";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import React from "react";
import DataSource from "devextreme/data/data_source";
import {frequencyStore} from "../../api/restructure_v2";


export const RestructureFormV2 = (props: any) => {
  const {restructure} = props;
  
  return <>
	<Form colCount={1} id="contractForm"
		  formData={restructure}>
	  <GroupItem colCount={2} cssClass={"dx-card responsive-paddings"}>
		<GroupItem colCount={1} caption={"Informasi"}>
		  <SimpleItem dataField="categoryName" label={{text: "Tipe"}}
					  editorOptions={{
						readOnly: true,
					  }}></SimpleItem>
		  <SimpleItem dataField="contractNumber" label={{text: "No.Pinjaman "}}
					  editorOptions={{
						readOnly: true,
					  }}></SimpleItem>
		  <SimpleItem dataField="removeSanction" label={{text: "Remove Sanction "}}
					  editorType="dxTextBox"
					  editorOptions={{
						value: restructure.removeSanction ? "true" : "false",
						readOnly: true,
					  }}></SimpleItem>
		  <SimpleItem dataField="discount" label={{text: "Diskon, % "}}
					  editorOptions={{
						readOnly: true,
					  }}></SimpleItem>
		  <SimpleItem dataField="initialPayment" label={{text: "Initial Payment "}}
					  editorOptions={{
						readOnly: true,
						format: "Rp #,##0",
					  }}></SimpleItem>
		  <SimpleItem dataField="principalAmount" label={{text: "Principle Amount "}}
					  editorOptions={{
						readOnly: true,
						format: "Rp #,##0",
					  }}></SimpleItem>
		  <SimpleItem dataField="interestAmount" label={{text: "Interest Amount "}}
					  editorOptions={{
						readOnly: true,
						format: "Rp #,##0",
					  }}></SimpleItem>
		  <SimpleItem dataField="penaltyAmount" label={{text: "Sanction "}}
					  editorOptions={{
						readOnly: true,
						format: "Rp #,##0",
					  }}></SimpleItem>
		  <SimpleItem dataField="restructureAmount" label={{text: "Restructure Amount "}}
					  editorOptions={{
						readOnly: true,
						format: "Rp #,##0",
					  }}></SimpleItem>
		</GroupItem>
		<GroupItem colCount={1} caption={"Repayment Settings"}>
		  <SimpleItem
			  dataField="firstPaymentDate"
			  label={{text: "First Payment Date"}}
			  editorOptions={{
				displayFormat: "dd MMM yyyy",
				min: new Date(),
				type: "date",
				readOnly: true,
			  }}
			  editorType="dxDateBox"
		  />
		  <SimpleItem
			  dataField="frequencyName"
			  label={{text: "Payment Frequency"}}
			  editorType="dxTextBox"
			  editorOptions={{
				readOnly: true,
			  }}
		  />
		  <SimpleItem
			  dataField="paymentAmount"
			  label={{text: "Payment amount"}}
			  editorOptions={{
				format: "Rp #,##0",
				readOnly: true,
			  }}
		  />
		  <SimpleItem
			  dataField="paymentPeriod"
			  label={{text: "Payment Period"}}
			  editorOptions={{
				readOnly: true,
			  }}
		  />
		</GroupItem>
	  </GroupItem>
	  <GroupItem colCount={1} caption="Schedule"
				 cssClass={"dx-card responsive-paddings"}>
		<DataGrid
			dataSource={restructure?.schedule}
			remoteOperations={true}
			columnAutoWidth={true}
			wordWrapEnabled={false}
			showBorders={true}
			dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
			repaintChangesOnly={true}
		>
		  <Scrolling showScrollbar={"always"}/>
		  <Column dataField={"period"} caption={"Cicilan Ke."} alignment={"center"} width={100}/>
		  <Column
			  dataField={"paymentDate"}
			  caption={"Payment Date"}
			  dataType={"date"}
			  format={"dd MMM yyyy"}
			  calculateFilterExpression={(
				  value: any,
				  selectedFilterOperations: any,
				  target: any
			  ) => {
				const column = this as any;
				return column.defaultCalculateFilterExpression.apply(this, [
				  new Date(value),
				  selectedFilterOperations,
				  target,
				]);
			  }}
			  filterOperations={filterOperation.date}
		  />
		  <Column dataField={"paymentAmount"} caption={"Payment Amount"}
				  format="Rp #,##0.00"/>
		  <Column dataField={"principalPayment"} caption={"Principle Amount"}
				  format="Rp #,##0.00"/>
		  <Column dataField={"interestPayment"} caption={"Interest"}
				  format="Rp #,##0.00"/>
		  <Column dataField={"remainingBalance"} caption={"Remaining Amount"}
				  format="Rp #,##0.00"/>
		  <Paging defaultPageSize={50}/>
		  <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]}/>
		</DataGrid>
	  </GroupItem>
	</Form>
  </>
}
