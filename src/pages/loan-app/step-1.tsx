import React, {useEffect, useRef, useState} from "react";
import Form, {
    ButtonItem,
    GroupItem,
    PatternRule,
    RequiredRule,
    SimpleItem,
} from "devextreme-react/form";
import {selectBoxOptions} from "src/api/contact";
import DataSource from "devextreme/data/data_source";
import "devextreme-react/file-uploader";
import "./loan-app.scss";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import "devextreme-react/date-box";
import {
    appLoanDetailApi,
    createAppLoanOnboardingStep1, detailAppLoan,
    getListBank,
    getLoanPurpose,
    loanTermStore,
} from "src/api/apploan";
import {
    AppLoanDetailRequest,
    AppLoanOnboardingStep1Request, AppLoanRequest,
    initLoanOnboardingStep1Value,
} from "src/interfaces/appLoanOnboarding";
import {store} from "src/store/store";
import {LoadPanel} from "devextreme-react/load-panel";
import notify from "devextreme/ui/notify";

export default function Step1Page() {
    const navigate = useNavigate();
    const {loanapp} = store.getState();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [onboardingLoan, setOnboardingLoan] =
        useState<AppLoanOnboardingStep1Request>(initLoanOnboardingStep1Value);
    const [submitForm, setSubmitForm] = useState(false);

    const formRef = useRef<Form>(null);

    useEffect(() => {
        detailAppLoan(String(id)).then((res) => {
            const data = res as AppLoanRequest;
            const map = {
                amount: data.loanAmount,
                termId: data.loanTermId,
                bankId: data.bankId,
                bankAccNumber: data.bankAccNumber,
                purposeId: data.loanPurposeId,
                monthlyIncome: data.monthlyIncome,
            };
            setOnboardingLoan(map);
        });
    }, [id]);

    useEffect(() => {
        setOnboardingLoan({
            amount: loanapp.loanappStep1.amount,
            termId: loanapp.loanappStep1.termId,
            bankId: loanapp.loanappStep1.bankId,
            bankAccNumber: loanapp.loanappStep1.bankAccNumber,
            purposeId: loanapp.loanappStep1.purposeId,
            monthlyIncome: loanapp.loanappStep1.monthlyIncome,
        });
    }, [loanapp]);

    const loanTerm = selectBoxOptions(
        new DataSource(loanTermStore(id as string)),
        "Pilih term"
    );

    const listBank = selectBoxOptions(new DataSource(getListBank), "Pilih bank");
    const listLoanPurpose = selectBoxOptions(
        new DataSource(getLoanPurpose),
        "Pilih tujuan pinjaman"
    );

    const handleSubmit = (e: any) => {
        setSubmitForm(true);
        const form = formRef.current!.instance;
        createAppLoanOnboardingStep1(id as string, onboardingLoan).then(
            (res) => {
                setOnboardingLoan(initLoanOnboardingStep1Value);
                form.resetValues();

                navigate(`/loan-app/create/step/2?id=${id}`);
            }, (error) => {
                setSubmitForm(false);
                notify(
                    {
                        message: error,
                        position: {
                            my: "center top",
                            at: "center top",
                        },
                    },
                    "error",
                    3000
                );
            }
        );

        e.preventDefault();
    };

    const onFieldDataChanged = (evt: any) => {
        onboardingLoan[evt.dataField] = evt.value;
    };

    return (
        <>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                visible={submitForm}
                showIndicator={true}
                shading={true}
                showPane={true}
                hideOnOutsideClick={false}
            />

            <h2 className={"content-block"}>Step 1</h2>
            <div className={"content-block"}>
                <div className={"dx-card responsive-paddings"}>
                    <form action="step1" onSubmit={handleSubmit}>
                        <Form
                            ref={formRef}
                            colCount={1}
                            id="form"
                            formData={onboardingLoan}
                            showColonAfterLabel={true}
                            showValidationSummary={true}
                            validationGroup="loanAppStep1"
                            onFieldDataChanged={onFieldDataChanged}
                        >
                            <GroupItem colSpan={2}>
                                <GroupItem caption="Pengajuan" colCount={2}>
                                    <SimpleItem
                                        dataField="amount"
                                        label={{text: "Jumlah Pinjaman"}}
                                        editorType="dxNumberBox"
                                        editorOptions={{format: "Rp #,##0.00"}}
                                    >
                                        <RequiredRule message="Jumlah Pinjaman is required"/>
                                        <PatternRule
                                            message="hanya angka"
                                            pattern={/^[0-9]+$/}
                                        />
                                    </SimpleItem>
                                    <SimpleItem
                                        dataField="termId"
                                        editorType="dxSelectBox"
                                        editorOptions={loanTerm}
                                        label={{text: "Jangka waktu"}}
                                    >
                                        <RequiredRule message="Jangka waktu wajib diisi"/>
                                    </SimpleItem>
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colSpan={2}>
                                <GroupItem caption="Pencairan" colCount={2}>
                                    <SimpleItem
                                        dataField="bankId"
                                        editorType="dxSelectBox"
                                        editorOptions={listBank}
                                        label={{text: "Bank"}}
                                    >
                                        <RequiredRule message="Bank wajib diisi"/>
                                    </SimpleItem>
                                    <SimpleItem
                                        dataField="bankAccNumber"
                                        label={{text: "Nomor Rekening"}}
                                    >
                                        <RequiredRule message="Nomor rekening wajib diisi"/>
                                    </SimpleItem>
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colSpan={2}>
                                <GroupItem caption="Informasi tambahan" colCount={2}>
                                    <SimpleItem
                                        dataField="purposeId"
                                        editorType="dxSelectBox"
                                        editorOptions={listLoanPurpose}
                                        label={{text: "Tujuan pinjaman"}}
                                    >
                                        <RequiredRule message="Tujuan pinjaman wajib diisi"/>
                                    </SimpleItem>
                                    <SimpleItem
                                        dataField="monthlyIncome"
                                        label={{text: "Penghasilan perbulan"}}
                                        editorType="dxNumberBox"
                                        editorOptions={{format: "Rp #,##0.00"}}
                                    >
                                        <RequiredRule message="Penghasilan perbulan wajib diisi"/>
                                        <PatternRule
                                            message="hanya boleh angka"
                                            pattern={/^[0-9]+$/}
                                        />
                                    </SimpleItem>
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colSpan={2}>
                                <GroupItem colCount={2}>
                                    <ButtonItem
                                        horizontalAlignment="left"
                                        buttonOptions={{
                                            text: "Batal",
                                            type: "normal",
                                            onClick: () => {
                                                navigate("/loan-app");
                                            },
                                        }}
                                    />
                                    <ButtonItem
                                        horizontalAlignment="right"
                                        buttonOptions={{
                                            text: "Lanjutkan",
                                            type: "default",
                                            useSubmitBehavior: true,
                                        }}
                                    />
                                </GroupItem>
                            </GroupItem>
                        </Form>
                    </form>
                </div>
            </div>
        </>
    );
}
