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
    AsyncRule
} from "devextreme-react/form";
import {formatRupiah} from "../../utils/string.util";
import DataSource from "devextreme/data/data_source";
import {calc, frequencyStore, reject, submit} from "../../api/restructure_v2";
import {DataGrid} from "devextreme-react";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import {notifyError, notifySuccess, notifyWarning} from "../../utils/devExtremeUtils";
import {confirm} from "devextreme/ui/dialog";
import {ValidationCallbackData} from "devextreme-react/common";
import {backofficeAccess, restructure_max_periods} from "../../constants/variableConstata";
import LoadPanel from "devextreme-react/load-panel";
import {checkAccess} from "../../api/apploan";


interface RestructureData {
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
    const formRef = useRef<any>(null);

    const [prevRequest, setPrevRequest] = useState<RestructureData>({});
    const [request, setRequest] = useState<RestructureData>({});
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
        calc(req).then((rest) => {
            const updateData = {...request};
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
            setRequest((prevState) => ({
                ...prevState,
                ...updateData
            }));
        }).catch(e => {
            console.error(e);
            // notifyWarning(e.message);
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
        // setRequest((prev)=>{
        //     setPrevRequest(prev);
        //     return {...prev, [evt.dataField]: evt.value};
        // });
        request[evt.dataField] = evt.value;
        calculateRestructure(request).then((rs)=>{console.log("restructure calculate", rs)});
        var editor = evt.component.getEditor("repaymentSetting.paymentPeriod");
        editor.focus();
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

    const asyncValidationInitialPayment = useCallback(({value}: ValidationCallbackData) => {
        return !(request.restructureAmount && (value > request.restructureAmount));
    }, [request]);

    const asyncRemoveSanctionValidation = (params: { value: any; }) => {
        const payload = {...request, removeSanction: params.value};
        return calculateRestructure(payload);
    };

    const asyncDiscountValidation = (params: { value: any; }) => {
        const payload = {...request, discount: params.value};
        return calculateRestructure(payload);
    };

    const asyncInitialPaymentValidation = (params: { value: any; }) => {
        const payload = {...request, initialAmount: params.value};
        return calculateRestructure(payload);
    };

    const asyncfirstPaymentDateValidation = (params: { value: any; }) => {
        const payload = {...request, "repaymentSetting.firstPaymentDate": params.value};
        return calculateRestructure(payload);
    };

    const asyncfrequenceValidation = (params: { value: any; }) => {
        const payload = {...request, "repaymentSetting.frequencyId": params.value};
        return calculateRestructure(payload);
    };

    const asyncPaymentAmountValidation = (params: { value: any; }) => {
        const payload = {...request, "repaymentSetting.paymentAmount": params.value};
        return calculateRestructure(payload);
    };

    const asyncPaymentPeriodValidation = (params: { value: any; }) => {
        const payload = {...request, "repaymentSetting.paymentPeriod": params.value};
        return calculateRestructure(payload);
    };


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
                                {/*<AsyncRule*/}
                                {/*    message="Terdapat kesalahan pada hapus pinalty"*/}
                                {/*    validationCallback={asyncRemoveSanctionValidation} />*/}
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
                                {/*<AsyncRule*/}
                                {/*    message="Terdapat pada input discount"*/}
                                {/*    validationCallback={asyncDiscountValidation} />*/}
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
                                        let forbiddenChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
                                        if (forbiddenChars.includes(key))
                                            e.event.preventDefault();
                                        if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                                            e.event.preventDefault();
                                    },
                                    placeholder: "Initial payment: 1.000.000",
                                    format: "Rp #,##0",
                                }}
                            >
                                {/*<AsyncRule*/}
                                {/*    message="Terdapat kesalahan pada input initial payment"*/}
                                {/*    validationCallback={asyncInitialPaymentValidation} />*/}
                                {/*<CustomRule*/}
                                {/*    message="Initial payment tidak boleh lebih dari balance"*/}
                                {/*    validationCallback={asyncValidationInitialPayment}*/}
                                {/*/>*/}
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
                                {/*<AsyncRule*/}
                                {/*    message="Terdapat kesalahan pada pengisian first payment date"*/}
                                {/*    validationCallback={asyncfirstPaymentDateValidation} />*/}
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
                                {/*<AsyncRule*/}
                                {/*    message="Terdapat kesalahan pada pengisian frequence"*/}
                                {/*    validationCallback={asyncfrequenceValidation} />*/}
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
                                    {/*<AsyncRule*/}
                                    {/*    message="Terdapat kesalahan pada pengisian payment amount"*/}
                                    {/*    validationCallback={asyncPaymentAmountValidation} />*/}
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
                                    {/*<AsyncRule*/}
                                    {/*    message="Terdapat kesalahan pada pengisian payment period"*/}
                                    {/*    validationCallback={asyncPaymentPeriodValidation} />*/}
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
