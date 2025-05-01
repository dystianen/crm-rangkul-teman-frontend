import React, {FC, useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import * as Title from "devextreme-react/toolbar";

import Form, {
    ButtonItem,
    CustomRule,
    GroupItem,
    PatternRule,
    SimpleItem,
    AsyncRule, RequiredRule
} from "devextreme-react/form";
import {formatRupiah} from "../../utils/string.util";
import DataSource from "devextreme/data/data_source";
import {calc, frequencyStore, submit} from "../../api/restructure_v2";
import {DataGrid} from "devextreme-react";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import {calculateFilterExpressionCustom, notifyError, notifySuccess, notifyWarning} from "../../utils/devExtremeUtils";
import {confirm} from "devextreme/ui/dialog";
import {ValidationCallbackData} from "devextreme-react/common";
import {backofficeAccess, restructure_max_periods} from "../../constants/variableConstata";
import LoadPanel from "devextreme-react/load-panel";
import {checkAccess} from "../../api/apploan";
import "./style.scss";
import {TextBoxTypes} from "devextreme-react/text-box";

interface RestructureData {
    contractId?: string;
    removeSanction?: boolean;
    discount?: number;
    initialAmount: number | null;

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
    const formRef = useRef<any>(null);
    const gridRef = useRef<DataGrid>(null);

    const [request, setRequest] = useState<RestructureData>({initialAmount: null});
    const [schedule, setSchedule] = useState<schedule[]>([]);

    const [loadingCalculate, setLoadingCalculate] = useState<boolean>(false);

    useEffect(() => {
        checkAccess(backofficeAccess.backoffice_restructure_write).then((res) => {
            if (!res) {
                notifyWarning("User tidak memiliki akses ke halaman ini!!");
                navigate(-1);
            }
        });
    }, []);

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
                        checkAccess(backofficeAccess.backoffice_restructure_read).then((res) => {
                            if (!res) {
                                navigate("/contract");
                            } else {
                                navigate("/restructure");
                            }
                        });
                    }).catch(() => notifyError("Submit Restruktur GAGAL!!"));
                }
            });
        }
        e.preventDefault();
    }

    const calculateRestructure = (req: RestructureData) => {
        setLoadingCalculate(true);
        if(req.initialAmount === null) req.initialAmount = 0;
        calc(req).then((rest) => {
            const updateData = {...request};
            updateData["principalAmount"] = rest.principalAmount;
            updateData["interestAmount"] = rest.interestAmount;
            updateData["penaltyAmount"] = rest.penaltyAmount;
            updateData["restructureAmount"] = rest.restructureAmount;
            updateData["scheduleTypeId"] = rest.scheduleTypeId;
            updateData["payment"] = rest.payment;
            updateData["numPayments"] = rest.numPayments;
            if(updateData.initialAmount === 0) {
                updateData["initialAmount"] = null;
            }

            if (typeof rest.schedule !== "undefined") {
                updateData["schedule"] = rest.schedule;
                setSchedule(rest.schedule);
            }
            setRequest((prevState) => ({
                ...prevState,
                ...updateData
            }));
        }).catch(e => {
            console.error(e);
            notifyWarning(e.message);
            return new Promise((reject) => reject(false));
        }).finally(() => {
            setLoadingCalculate(false);
            return new Promise((resolve) => resolve(true));
        });
        return new Promise((resolve) => resolve(true));
    }

    useEffect(() => {
        request["contractId"] = id;
        calculateRestructure(request).then((rs)=>{console.log("init calculate", rs)});
    }, [id]);
    
    const onFieldDataChanged = (evt: any) => {
        request[evt.dataField] = evt.value;
        var {isValid} = evt.component.instance().validate();
        if(isValid) {
            calculateRestructure(request)
                .then((rs)=>console.info("calculate restructure", rs));
        }
    };

    const minMaxDiscountValid = useCallback(
        ({value}: ValidationCallbackData) => {
            return !(value != null && (value > 100 && value < 0));
        }, [request]);

    const minPaymentAmountValid = useCallback(
        ({value}: ValidationCallbackData) => {
            if (value === 0) return true;
            return value >= 400000;
        }, [request]);

    const maxPaymentAmountValid = useCallback(
        ({value}: ValidationCallbackData) => {
            return !(request.restructureAmount && (value > request.restructureAmount));
        }, [request]);

    const maxPeriodValid = useCallback(
        ({value}: ValidationCallbackData) => {
            return !(request.repaymentSetting?.frequencyId && (value > restructure_max_periods[request.repaymentSetting?.frequencyId]));
        }, [request]);
    
    const minValidationInitialPaymentValid = useCallback(
        ({value}: ValidationCallbackData) => {
            return !(value <= 0);
        }, [request]);

    const nullValidationInitialPaymentValid = useCallback(
        ({value}: ValidationCallbackData) => {
            return new Promise((resolve) => resolve(!(value===null)));
        }, [request]);
    
    const asyncValidationInitialPayment = useCallback(({value}: ValidationCallbackData) => {
        let restructureAmount = 0;
        //principal + interest + IF(rm_sanctions is True, 0, sanction) - initial payment) * (1 - discount)
        if(typeof request.principalAmount !== "undefined" && typeof request.interestAmount !== "undefined" ){
            restructureAmount = request.principalAmount + request.interestAmount;
        }
        if(typeof request.removeSanction !== "undefined" && !request.removeSanction){
            restructureAmount += request.principalAmount || 0;
        }
        restructureAmount = restructureAmount - value;
        
        if(typeof  request.discount !== "undefined" && request.discount > 0) {
            restructureAmount = restructureAmount * (1 - (request.discount/100));
        }
        console.log("restructureAmount : ", restructureAmount);
        return !(restructureAmount < 0);
    }, [request]);

    const onInitialAmountChange = useCallback((e: TextBoxTypes.ValueChangedEvent) => {
        console.log("onInitialAmountChange", e);
        if(e.value === 0)setRequest((prevState) => ({
            ...prevState,
            initialAmount: null,
        }));
        const form = formRef.current!.instance;
        console.log("onInitialAmountChange request ", request);
        const {isValid} = form.validate();
        if(isValid){
            e.event && e.event.preventDefault();
        }
    }, [request]);

    return <> <LoadPanel visible={loadingCalculate}/>
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
            <form className="form__tabs" action="restructure-submit" onSubmit={onFormSubmit}>
                <Form
                    ref={formRef}
                    formData={request}
                    colCount={2}
                    readOnly={false}
                    id="restructureCreateForm"
                    onFieldDataChanged={onFieldDataChanged}
                    showColonAfterLabel={true}
                    showValidationSummary={true}
                    validationGroup="restructureCreateForm"
                >
                    <GroupItem colSpan={2} caption="Balance" colCount={2}
                               cssClass={"dx-card responsive-paddings next-card"}>
                        <GroupItem>
                            <SimpleItem>
                                Principal Amount : {request.principalAmount && formatRupiah(request.principalAmount)}
                            </SimpleItem>
                            <SimpleItem>
                                Due interest amount : {request.interestAmount && formatRupiah(request.interestAmount)}
                            </SimpleItem>
                            <SimpleItem>
                                Sanctions : {request.penaltyAmount && formatRupiah(request.penaltyAmount)}
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem>
                            <SimpleItem
                                cssClass={"itemRemoveSanction"}
                                dataField="removeSanction"
                                editorType="dxSwitch"
                                label={{text: "Remove Sanctions", showColon:false, alignment: "center", location: "right"}}
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
                                        let forbiddenChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
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
                                cssClass={"itemInitialPayment"}
                                dataField="initialAmount"
                                label={{text: " ", showColon: false, alignment: "center", location: "right", visible: false}}
                                editorType={"dxNumberBox"}
                                editorOptions={{
                                    onKeyDown: (e: any) => {
                                        const key = e.event.key;
                                        e.value = String.fromCharCode(e.event.keyCode);
                                        let forbiddenChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
                                        if (forbiddenChars.includes(key))
                                            e.event.preventDefault();
                                        if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                                            e.event.preventDefault();
                                    },
                                    // value: (request.initialAmount !== null && request.initialAmount > 0 ? request.initialAmount : null),
                                    // onValueChanged: onInitialAmountChange,
                                    placeholder: "Initial payment: 1.000.000",
                                    format: "Rp #,##0",
                                }}
                            >
                                <AsyncRule
                                    message="Initial payment wajib diisi"
                                    validationCallback={nullValidationInitialPaymentValid}
                                />
                                <CustomRule
                                    message="Initial payment harus diisi"
                                    validationCallback={minValidationInitialPaymentValid}
                                />
                                <CustomRule
                                    message="Initial payment tidak boleh lebih dari balance"
                                    validationCallback={asyncValidationInitialPayment}
                                />
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
                            >
                            </SimpleItem>
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
                                            let forbiddenChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
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
                                    <CustomRule message="Maximum payment amount tidak boleh melebihi balance"
                                                validationCallback={maxPaymentAmountValid}/>
                                    <PatternRule message="Payment amount hanya boleh angka" pattern={/^[0-9]+$/}/>
                                </SimpleItem>
                                <SimpleItem cssClass="topPadding25">
                                    <div className={"bgDesc"}>Min. 400.000</div>
                                </SimpleItem>
                            </GroupItem>
                            <GroupItem colCount={2}>

                                <SimpleItem
                                    dataField="repaymentSetting.paymentPeriod"
                                    label={{text: "Payment period"}}
                                    editorOptions={{
                                        onKeyDown: (e: any) => {
                                            const key = e.event.key;
                                            e.value = String.fromCharCode(e.event.keyCode);
                                            let forbiddenChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
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
                                <SimpleItem cssClass="topPadding25">
                                    <div className="bgDesc">Max : 3years</div>
                                </SimpleItem>
                            </GroupItem>
                        </GroupItem>
                    </GroupItem>
                    <GroupItem colSpan={2} caption={"Schedule"} colCount={1}
                               cssClass={"dx-card responsive-paddings next-card"}>
                        <DataGrid
                            ref={gridRef}
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
