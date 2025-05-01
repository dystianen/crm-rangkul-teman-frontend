import React, {FC, useEffect, useRef, useState} from "react";
import {AsyncRule, RequiredRule, Validator} from "devextreme-react/validator";
import Form, {Item, ButtonItem, PatternRule, SimpleItem, GroupItem} from "devextreme-react/form";
import {Popup} from "devextreme-react";
import DataSource from "devextreme/data/data_source";
import {calc, frequencyStore, submit} from "../../api/restructure_v2";
import {calculateFilterExpressionCustom, notifyError, notifySuccess} from "../../utils/devExtremeUtils";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {DataGrid} from "devextreme-react";
import {filterOperation} from "../../constants/FilterOperation";

import {confirm} from 'devextreme/ui/dialog';
import {formatRupiah} from "../../utils/string.util";
import "./style.scss"

interface restructureData {
  contractId?: string;
  removeSanction?: boolean;
  discount?: number;
  initialAmount?: number;
  
  repaymentSetting?: {
	firstPaymentDate?: string;
	frequencyId?: string;
	paymentAmount?: number;
	paymentPeriod?: number;
  };
  principalAmount?: number;
  interestAmount?: number;
  penaltyAmount?: number;
  restructureAmount?: number;
  
  scheduleTypeId?: string;
  payment?: number;
  numPayments?: number;
  schedule?: schedule[];
}

interface schedule {
  period?: number;
  paymentDate?: string;
  paymentAmount?: number;
  principalPayment?: number;
  interestPayment?: number;
  remainingBalance?: number;
}

export const RestructurePopupV2: FC<any> = (props, context) => {
  
  const formRef = useRef<Form>(null);
  const [request, setRequest] = useState<restructureData>({});
  const [schedule, setSchedule] = useState<schedule[]>([]);
  const {popupVisible, hide, data} = props;
  
  const onFormSubmit = (e: any) => {
	const form = formRef.current!.instance;
	console.log(data, request);
	const {isValid} = form.validate();
	if (isValid && data?.id) {
	  
	  if (typeof request.schedule === "undefined" || request.schedule === null) {
		notifyError("schedule tidak boleh kosong!!");
		e.preventDefault();
		return;
	  }
	  
	  confirm("Apakah data yang sudah sesuai?", "Konfirmasi Restruktur").then((dialogResult) => {
		if (dialogResult) {
		  submit(request).then(sr => {
			notifySuccess("Submit data berhasil!!");
			hide();
		  }).catch(() => notifyError("Submit Restruktur GAGAL!!"));
		}
	  });
	}
	e.preventDefault();
  }
  
  const onFieldDataChanged = (evt: any) => {
	const form = formRef.current!.instance;
	request[evt.dataField] = evt.value;
	calc(request).then((rest) => {
	  form.option('formData.principalAmount', rest.principalAmount);
	  form.option('formData.interestAmount', rest.interestAmount);
	  form.option('formData.penaltyAmount', rest.penaltyAmount);
	  form.option('formData.restructureAmount', rest.restructureAmount);
	  request["principalAmount"] = rest.principalAmount;
	  request["interestAmount"] = rest.interestAmount;
	  request["penaltyAmount"] = rest.penaltyAmount;
	  request["restructureAmount"] = rest.restructureAmount;
	  request["scheduleTypeId"] = rest.scheduleTypeId;
	  request["payment"] = rest.payment;
	  request["numPayments"] = rest.numPayments;
	  if (typeof rest.schedule !== "undefined") {
		request["schedule"] = rest.schedule;
		setSchedule(rest.schedule);
	  }
	});
  }
  
  const asyncValidation = (params: { value: any; }) => {
	const isVal = params.value >= 1 && params.value <= 100;
	return new Promise((resolve) => {
	  setTimeout(() => {
		resolve(isVal);
	  }, 1000);
	});
  };
  
  useEffect(() => {
	if (data?.id !== "") {
	  console.log("show props restructure v2", data);
	  request["contractId"] = data?.id;
	  calc(request).then((rest) => {
		request["principalAmount"] = rest.principalAmount;
		request["interestAmount"] = rest.interestAmount;
		request["penaltyAmount"] = rest.penaltyAmount;
		request["restructureAmount"] = rest.restructureAmount;
		if (typeof rest.schedule !== "undefined") {
		  request["schedule"] = rest.schedule;
		}
	  });
	}
  }, [props]);
  
  return (<>
	<Popup
		width={480}
		visible={popupVisible}
		onHiding={hide}
		showCloseButton={true}
		title="Restruktur">
	  <form onSubmit={onFormSubmit}>
		<Form
			ref={formRef}
			colCount={1}
			id="restructureForm"
			formData={request}
			showColonAfterLabel={true}
			showValidationSummary={true}
			validationGroup="restructureForm"
			onFieldDataChanged={onFieldDataChanged}
		>
		  <GroupItem caption="Balance" colCount={2}>
			<GroupItem>
			  <SimpleItem>
				Principal Amount : {formatRupiah(request.principalAmount)}
			  </SimpleItem>
			  <SimpleItem>
				Interest Amount : {formatRupiah(request.interestAmount)}
			  </SimpleItem>
			  <SimpleItem>
				Sanctions : {formatRupiah(request.penaltyAmount)}
			  </SimpleItem>
			</GroupItem>
			<GroupItem>
			  <SimpleItem
				  dataField="removeSanction"
				  editorType="dxSwitch"
				  label={{text: " ", showColon: false}}
				  editorOptions={{
					defaultValue: false,
				  }}
			  >
			  </SimpleItem>
			  <SimpleItem
				  dataField="discount"
				  label={{text: " ", showColon: false}}
				  editorOptions={{
					placeholder: "Diskon, %"
				  }}
			  >
			  </SimpleItem>
			  <SimpleItem
				  dataField="initialAmount"
				  label={{text: " ", showColon: false}}
				  editorOptions={{
					placeholder: "Initial payment: 1.000.000",
					format: "Rp #,##0",
				  }}
			  >
			  </SimpleItem>
			</GroupItem>
			
			<SimpleItem colSpan={2}>
			  <div className="restrutureAmountPopV2">Restructure Amount
				: {formatRupiah(request.restructureAmount)}</div>
			</SimpleItem>
		  </GroupItem>
		  {/*<GroupItem colCount={1}>*/}
		  {/*    <SimpleItem*/}
		  {/*        cssClass={"restructureAmount"}*/}
		  {/*        dataField="restructureAmount"*/}
		  {/*        label={{text: "Restructure amount"}}*/}
		  {/*        editorOptions={{*/}
		  {/*            value: request.restructureAmount,*/}
		  {/*            readOnly: true,*/}
		  {/*            format: "#,##0 Rp",*/}
		  {/*        }}*/}
		  {/*    >*/}
		  {/*    </SimpleItem>*/}
		  {/*</GroupItem>*/}
		  <GroupItem caption={"Repayment Setting"} colCount={1}>
			<SimpleItem
				dataField="repaymentSetting.firstPaymentDate"
				label={{text: "First Payment Date"}}
				editorOptions={{
				  displayFormat: "dd MMM yyyy",
				  type: "date"
				}}
				editorType="dxDateBox"
			/>
			<SimpleItem
				dataField="repaymentSetting.frequencyId"
				label={{text: "Frequency"}}
				editorType="dxSelectBox"
				editorOptions={{
				  dataSource: new DataSource(frequencyStore),
				  valueExpr: "id",
				  displayExpr: "name",
				  searchEnabled: false
				}}
			>
			</SimpleItem>
			<SimpleItem
				dataField="repaymentSetting.paymentAmount"
				label={{text: "Payment amount"}}
				editorOptions={{}}
			>
			</SimpleItem>
			<SimpleItem
				dataField="repaymentSetting.paymentPeriod"
				label={{text: "Payment period"}}
				editorOptions={{}}
			>
			</SimpleItem>
		  </GroupItem>
		  <GroupItem caption={"Schedule"} colCount={1}>
			<DataGrid
				dataSource={schedule}
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
				  calculateFilterExpression={calculateFilterExpressionCustom}
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
		  <ButtonItem
			  horizontalAlignment="left"
			  buttonOptions={{
				width: "100%",
				text: "Submit",
				type: "success",
				useSubmitBehavior: true,
			  }}
		  />
		</Form>
	  </form>
	</Popup>
  </>);
  
}
