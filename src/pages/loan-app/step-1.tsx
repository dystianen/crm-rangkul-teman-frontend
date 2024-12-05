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
    appLoanDetailApi, checkAccess,
    createAppLoanOnboardingStep1, detailAppLoan, detailAppStep,
    getListBank,
    getLoanPurpose, getUnsignedDoc,
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
import {useAuth} from "../../contexts/auth";
import {Button} from "devextreme-react/button";

export default function Step1Page() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {loanapp} = store.getState();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [onboardingLoan, setOnboardingLoan] =
        useState<AppLoanOnboardingStep1Request>(initLoanOnboardingStep1Value);
    const [submitForm, setSubmitForm] = useState(false);
    const [loadingDownloadBtn, setLoadingDownloadBtn] = useState(false);

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

    const downloadUnsigned = (e: any)=>{
        console.log("Download unsigned", e);
        setLoadingDownloadBtn(true);
        getUnsignedDoc(id as any).then((dt)=>{
            console.log("dta ", dt);
            const link = document.createElement("a");
            link.href = `data:${dt.fileType};base64,${dt.fileContent}`;
            link.target = "_blank";
            link.download = dt.fileName;
            link.click();
        }).catch((e)=>{
            console.log(e.message);
            notify(
                {
                    message: e?.message,
                    position: {
                        my: "center top",
                        at: "center top",
                    },
                },
                "warning",
                15000
            );
        }).finally(()=>setLoadingDownloadBtn(false))
    }

    const handleSubmit = (e: any) => {
        setSubmitForm(true);
        // const form = formRef.current!.instance;
        // form.validate();
        createAppLoanOnboardingStep1(id as string, onboardingLoan).then(
            (res) => {
                checkAccess('0c0983ad-20b2-446d-8462-328aa64915f7').then((res) => {
                    if (res) {
                        navigate(`/loan-app/create/step/2?id=${id}`);
                    } else {
                        notify(
                            {
                                message: "Berhasil submit data",
                                position: {
                                    my: "center top",
                                    at: "center top",
                                },
                            },
                            "success",
                            15000
                        );
                        navigate(`/loan-app`);
                    }
                });
                // if (typeof user !== 'undefined') {
                //     if (typeof user.steps !== 'undefined') {
                //         const found = user.steps.some(el => el.id === 'fdebb3bc-4c43-4559-aa9c-dd8345e382e4');
                //         if (found) {
                //             navigate(`/loan-app/create/step/2?id=${id}`);
                //         }
                //     }
                // }
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
                    15000
                );
            }
        ).finally(() => {
            // setOnboardingLoan(initLoanOnboardingStep1Value);
            // form.resetValues();
        });

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

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin:"0 15px 0"}}>
                <h2>Step 1</h2>
                <Button
                    text="Download Unsigned Contract"
                    type="success"
                    stylingMode="contained"
                    disabled={loadingDownloadBtn}
                    onClick={(e) => downloadUnsigned(e)}
                />
            </div>
            <div className={"content-block"}>
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
                        <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
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

                            <GroupItem caption="Informasi tambahan" colCount={2}>
                                <SimpleItem
                                    dataField="purposeId"
                                    editorType="dxSelectBox"
                                    editorOptions={listLoanPurpose}
                                    label={{text: "Tujuan pinjaman"}}
                                >
                                    <RequiredRule message="Tujuan pinjaman wajib diisi"/>
                                </SimpleItem>
                            </GroupItem>

                        </GroupItem>
                        <GroupItem colSpan={2}>
                            <GroupItem colCount={2}>
                                <ButtonItem
                                    horizontalAlignment="left"
                                    buttonOptions={{
                                        text: "Kembali",
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
        </>
    );
}
