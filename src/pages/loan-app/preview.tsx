import React, {useEffect, useState} from "react";
import Form, {GroupItem, SimpleItem} from "devextreme-react/form";

import "devextreme-react/file-uploader";
import "./loan-app.scss";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import "devextreme-react/date-box";
import {Button, DataGrid, LoadPanel} from "devextreme-react";
import {
    Column,
    FilterRow,
    Item,
    Pager,
    Paging,
    Scrolling,
} from "devextreme-react/data-grid";
import {detailAppLoan, submitAppLoan} from "src/api/apploan";
import {
    AppLoanRequest,
    initLoanAppValue,
} from "src/interfaces/appLoanOnboarding";
import {getFileBase64} from "src/api/helper";
import notify from "devextreme/ui/notify";
import PdfViewer from "../../components/pdf-viewer/PdfViewer";

export default function PreviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [submitForm, setSubmitForm] = useState(false);

    const [loanApp, setLoanApp] = useState<AppLoanRequest>(initLoanAppValue);
    useEffect(() => {
        detailAppLoan(id as string).then((res) => {
            console.log("Detail : ", res);
            if(res?.statusName != "Incomplete") {
                navigate(`/loan-app`);
            }
            setLoanApp(res);
        });
    }, [id]);

    const handleSubmit = (e: any) => {
        setSubmitForm(true);
        submitAppLoan(id as string).then(() => {
            notify(
                {
                    message: "Submit loan application success",
                    position: {
                        my: "center top",
                        at: "center top",
                    },
                },
                "success",
                3000
            );
            navigate(`/loan-app/detail?id=${id}`);
        });
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
            <h2 className={"content-block"}>Preview</h2>
            <div className={"content-block"}>
                <div className={"dx-card responsive-paddings"}>
                    <form action="#" onSubmit={handleSubmit}>
                        <Form
                            colCount={1}
                            id="formpreview"
                            showColonAfterLabel={true}
                            validationGroup="contactData"
                            formData={loanApp}
                        >
                            <GroupItem colSpan={2}>
                                <GroupItem caption="Pengajuan" colCount={2}>
                                    <SimpleItem
                                        dataField="loanAmount"
                                        label={{text: "Jumlah Pinjaman"}}
                                        editorOptions={{format: "Rp #,##0", disabled: true}}
                                    ></SimpleItem>
                                    <SimpleItem
                                        dataField="loanTerm"
                                        label={{text: "Jangka Waktu"}}
                                        editorOptions={{disabled: true}}
                                    ></SimpleItem>
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colSpan={2}>
                                <GroupItem caption="Pencairan" colCount={2}>
                                    <SimpleItem
                                        dataField="bankName"
                                        label={{text: "Bank"}}
                                        editorOptions={{disabled: true}}
                                    ></SimpleItem>
                                    <SimpleItem
                                        dataField="bankAccNumber"
                                        label={{text: "Nomor Rekening"}}
                                        editorOptions={{disabled: true}}
                                    ></SimpleItem>
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colSpan={2}>
                                <GroupItem caption="Informasi Tambahan" colCount={2}>
                                    <SimpleItem
                                        dataField="loanPurpose"
                                        label={{text: "Tujuan Pinjaman"}}
                                        editorOptions={{disabled: true}}
                                    ></SimpleItem>
                                    <SimpleItem
                                        dataField="monthlyIncome"
                                        label={{text: "Penghasilan perbulan"}}
                                        editorOptions={{format: "Rp #,##0", disabled: true}}
                                    ></SimpleItem>
                                </GroupItem>
                            </GroupItem>
                        </Form>
                    </form>
                </div>
                <div className={"dx-card responsive-paddings next-card"}>
                    <h3>Custom Data</h3>
                    <DataGrid
                        dataSource={loanApp.customData}
                        remoteOperations={true}
                        columnAutoWidth={true}
                        wordWrapEnabled={false}
                        showBorders={true}
                        dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                        repaintChangesOnly={true}
                    >
                        <Scrolling showScrollbar={"always"}/>
                        <FilterRow visible={true}/>
                        <Column dataField={"no"} caption={"No."} width={70}/>
                        <Column dataField={"name"} caption={"Name"}/>
                        <Column dataField={"value"} caption={"Value"}/>
                        <Paging defaultPageSize={50}/>
                        <Pager
                            showPageSizeSelector={true}
                            showInfo={true}
                            allowedPageSizes={[10, 50, 100]}
                        />
                    </DataGrid>
                </div>

                <div className={"dx-card responsive-paddings next-card"}>
                    <h3>Income Proof</h3>
                    <Form
                        colCount={1}
                        id="form"
                        showColonAfterLabel={true}
                        showValidationSummary={true}
                        validationGroup="contactData"
                    >
                        {loanApp.incomeProof && (
                            <GroupItem colSpan={1}>
                                <Item>
                                    {loanApp.incomeProof.fileType.includes("image/") ? <img
                                            id="dropzone-ktp"
                                            src={getFileBase64(
                                                loanApp.incomeProof.fileType,
                                                loanApp.incomeProof.fileContent
                                            )}
                                            alt="ktp"
                                            width={"50%"}
                                        /> :
                                        <PdfViewer url={getFileBase64(
                                            loanApp.incomeProof.fileType,
                                            loanApp.incomeProof.fileContent
                                        )}/>
                                    }
                                </Item>
                            </GroupItem>
                        )}
                    </Form>
                </div>
                <div className="next-card btn-flex">
                    <Button
                        text="Kembali"
                        type="normal"
                        onClick={() => {
                            navigate(`/loan-app/create/step/2?id=${id}`);
                        }}
                    />
                    <Button
                        text="Submit"
                        type="default"
                        onClick={(e: any) => {
                            handleSubmit(e);
                        }}
                    />
                </div>
            </div>
        </>
    );
}
