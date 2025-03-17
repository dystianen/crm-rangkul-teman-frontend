import React, {FC, useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import * as Title from "devextreme-react/toolbar";
import Form, {ButtonItem, CustomRule, GroupItem, PatternRule, SimpleItem} from "devextreme-react/form";
import {formatRupiah} from "../../utils/string.util";
import DataSource from "devextreme/data/data_source";
import {calc, frequencyStore, submit} from "../../api/restructure_v2";
import {DataGrid} from "devextreme-react";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import {notifyError, notifySuccess} from "../../utils/devExtremeUtils";
import {confirm} from "devextreme/ui/dialog";
import {ValidationCallbackData} from "devextreme-react/common";
import {restructure_max_periods} from "../../constants/variableConstata";


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


export const RestructureCreatePage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id}: any = queryString.parse(location.search);
  
  const formRef = useRef<Form>(null);
  const [request, setRequest] = useState<restructureData>({});
  const [schedule, setSchedule] = useState<schedule[]>([]);
  
  const onFormSubmit = (e: any) => {
	const form = formRef.current!.instance;
	console.log("submit create restructure", request);
	const {isValid} = form.validate();
	if (isValid) {
	  
	  if (typeof request.schedule === "undefined" || request.schedule === null) {
		notifyError("schedule tidak boleh kosong!!");
		e.preventDefault();
		return;
	  }
	  
	  confirm("Apakah data yang diinput sudah sesuai?", "Konfirmasi Restruktur").then((dialogResult) => {
		if (dialogResult) {
		  submit(request).then(sr => {
			notifySuccess("Submit data berhasil!!");
			navigate("/restructure");
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
	  const updateData = {...request};
	  // form.option('formData.principalAmount', rest.principalAmount);
	  // form.option('formData.interestAmount', rest.interestAmount);
	  // form.option('formData.penaltyAmount', rest.penaltyAmount);
	  // form.option('formData.restructureAmount', rest.restructureAmount);
	  updateData["principalAmount"] = rest.principalAmount;
	  updateData["interestAmount"] = rest.interestAmount;
	  updateData["penaltyAmount"] = rest.penaltyAmount;
	  updateData["restructureAmount"] = rest.restructureAmount;
	  updateData["scheduleTypeId"] = rest.scheduleTypeId;
	  updateData["payment"] = rest.payment;
	  updateData["numPayments"] = rest.numPayments;
	  if (typeof rest.schedule !== "undefined") {
		updateData["schedule"] = rest.schedule;
		setSchedule(rest.schedule);
	  }
	  setRequest(updateData);
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
  
  const minMaxDiscountValid = useCallback(
	  ({value}: ValidationCallbackData) => {
		if(request.discount != null && (request.discount > 100 && request.discount<0)) return false;
		return true;
	  },[request]);
  
  const minPaymentAmountValid = useCallback(
	  ({value}: ValidationCallbackData) => {
		if(request.repaymentSetting?.paymentAmount != null && request.repaymentSetting?.paymentAmount < 400000) return false;
		return true;
	  },[request]);
  
  const maxPeriodValid = useCallback(
	  ({value}: ValidationCallbackData) => {
		if(request.repaymentSetting?.frequencyId && (value > restructure_max_periods[request.repaymentSetting?.frequencyId])) return false;
		return true;
	  },[request]);
  
  useEffect(() => {
	request["contractId"] = id;
	calc(request).then((rest) => {
	  const data = {...request};
	  data["principalAmount"] = rest.principalAmount;
	  data["interestAmount"] = rest.interestAmount;
	  data["penaltyAmount"] = rest.penaltyAmount;
	  data["restructureAmount"] = rest.restructureAmount;
	  if (typeof rest.schedule !== "undefined") {
		data["schedule"] = rest.schedule;
	  }
	  setRequest(data);
	});
  }, [id]);
  return <>
	<div className="title-detail">
	  <h2 className={"content-block"}>Create Restructure</h2>
	</div>
	<div className={"content-block"}>
	  <Title.Toolbar className={"dx-card"}>
		<Title.Item
			location="before"
			widget="dxButton"
			options={{
			  icon: "back",
			  text: "Kembali",
			  onClick: () => {
				navigate(-1);
			  }
			}}
		/>
	  </Title.Toolbar>
	  <form className="form__tabs" onSubmit={onFormSubmit}>
		<Form
			ref={formRef}
			colCount={2}
			id="restructureCreateForm"
			formData={request}
			showColonAfterLabel={true}
			showValidationSummary={true}
			validationGroup="restructureCreateForm"
			onFieldDataChanged={onFieldDataChanged}
		>
		  <GroupItem colSpan={2} caption="Balance" colCount={2} cssClass={"dx-card responsive-paddings next-card"}>
			<GroupItem>
			  <SimpleItem>
				Principal Amount : {request.principalAmount && formatRupiah(request.principalAmount)}
			  </SimpleItem>
			  <SimpleItem>
				Interest Amount : {request.interestAmount && formatRupiah(request.interestAmount)}
			  </SimpleItem>
			  <SimpleItem>
				Sanctions : {request.penaltyAmount && formatRupiah(request.penaltyAmount)}
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
					onKeyDown: (e: any) => {
					  const key = e.event.key;
					  e.value = String.fromCharCode(e.event.keyCode);
					  let forbiddenChars = ['!','@','#','$','%','^','&','*','(',')'];
					  if (forbiddenChars.includes(key))
						e.event.preventDefault();
					  if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
						e.event.preventDefault();
					},
					placeholder: "Diskon, %",
					maxLength: 2
				  }}
			  >
				<CustomRule
					message={'Diskon tidak valid'}
					validationCallback={minMaxDiscountValid}
				/>
				<PatternRule message="Diskon hanya boleh angka" pattern={/^[0-9]+$/}/>
			  </SimpleItem>
			  <SimpleItem
				  dataField="initialAmount"
				  label={{text: " ", showColon: false}}
				  editorType={"dxNumberBox"}
				  editorOptions={{
					onKeyDown: (e: any) => {
					  const key = e.event.key;
					  e.value = String.fromCharCode(e.event.keyCode);
					  let forbiddenChars = ['!','@','#','$','%','^','&','*','(',')'];
					  if (forbiddenChars.includes(key))
						e.event.preventDefault();
					  if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
						e.event.preventDefault();
					},
					placeholder: "Initial payment: 1.000.000",
					format: "Rp #,##0",
				  }}
			  >
				<PatternRule message="Initial payment hanya boleh angka" pattern={/^[0-9]+$/}/>
			  </SimpleItem>
			</GroupItem>
			
			<SimpleItem colSpan={2}>
			  <div className="restrutureAmountPopV2">Restructure Amount
				: {request.restructureAmount && formatRupiah(request.restructureAmount)}</div>
			</SimpleItem>
		  </GroupItem>
		  <GroupItem colSpan={2} caption={"Repayment Setting"} colCount={1}
					 cssClass={"dx-card responsive-paddings next-card"}>
			<GroupItem>
			  <SimpleItem
				  dataField="repaymentSetting.firstPaymentDate"
				  label={{text: "First Payment Date"}}
				  editorOptions={{
					width: "50%",
					displayFormat: "dd MMM yyyy",
					min: new Date(),
					type: "date"
				  }}
				  editorType="dxDateBox"
			  />
			  <SimpleItem
				  dataField="repaymentSetting.frequencyId"
				  label={{text: "Frequency"}}
				  editorType="dxSelectBox"
				  editorOptions={{
					width: "50%",
					dataSource: new DataSource(frequencyStore),
					valueExpr: "id",
					displayExpr: "name",
					searchEnabled: false
				  }}
			  >
			  </SimpleItem>
			  <GroupItem colCount={2}>
				<SimpleItem
					dataField="repaymentSetting.paymentAmount"
					label={{text: "Payment amount"}}
					editorType={"dxNumberBox"}
					editorOptions={{
					  onKeyDown: (e: any) => {
						const key = e.event.key;
						e.value = String.fromCharCode(e.event.keyCode);
						let forbiddenChars = ['!','@','#','$','%','^','&','*','(',')'];
						if (forbiddenChars.includes(key))
						  e.event.preventDefault();
						if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
						  e.event.preventDefault();
					  },
					  format: "Rp #,##0",
					}}
				>
				  <CustomRule
					  message={'Min. 400.000'}
					  validationCallback={minPaymentAmountValid}
				  />
				  <PatternRule message="Payment amount hanya boleh angka" pattern={/^[0-9]+$/}/>
				</SimpleItem>
				<SimpleItem cssClass="topPadding25"><div className={"bgDesc"}>Min. 400.000</div></SimpleItem>
			  </GroupItem>
			  <GroupItem colCount={2}>
				
				<SimpleItem
					dataField="repaymentSetting.paymentPeriod"
					label={{text: "Payment period"}}
					editorOptions={{
					  onKeyDown: (e: any) => {
						const key = e.event.key;
						e.value = String.fromCharCode(e.event.keyCode);
						let forbiddenChars = ['!','@','#','$','%','^','&','*','(',')'];
						if (forbiddenChars.includes(key))
						  e.event.preventDefault();
						if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
						  e.event.preventDefault();
					  },
					}}
				>
				  <CustomRule
					  message={'Max 3 years'}
					  validationCallback={maxPeriodValid}
				  />
				  <PatternRule message="Payment period hanya boleh angka" pattern={/^[0-9]+$/}/>
				</SimpleItem>
				<SimpleItem cssClass="topPadding25"><div className="bgDesc">Max : 3years</div> </SimpleItem>
			  </GroupItem>
			</GroupItem>
			{/*<GroupItem>&nbsp;</GroupItem>*/}
		  </GroupItem>
		  <GroupItem colSpan={2} caption={"Schedule"} colCount={1} cssClass={"dx-card responsive-paddings next-card"}>
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
		  <ButtonItem
			  horizontalAlignment="left"
			  buttonOptions={{
				text: "Submit",
				type: "success",
				useSubmitBehavior: true,
			  }}
		  />
		</Form>
	  </form>
	</div>
  </>
}
