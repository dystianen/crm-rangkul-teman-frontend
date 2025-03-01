import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import { useEffect, useState } from "react";

import "devextreme-react/file-uploader";
import queryString from "query-string";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import "./loan-app.scss";

import { Button, DataGrid, LoadPanel } from "devextreme-react";
import { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme-react/date-box";
import notify from "devextreme/ui/notify";
import { checkAccess, detailAppLoan, submitAppLoan } from "src/api/apploan";
import { getFileBase64 } from "src/api/helper";
import NeighbourQuestions from "src/components/loan-app/NeighbourQuestions";
import SellingQuestions from "src/components/loan-app/SellingQuestions";
import StreetShop from "src/components/loan-app/StreetShop";
import { AppLoanRequest, initLoanAppValue } from "src/interfaces/appLoanOnboarding";
import PdfViewer from "../../components/pdf-viewer/PdfViewer";
import { appStatusIncomplete } from "../../constants/variableConstata";
import { notifyWarning } from "../../utils/devExtremeUtils";
import FamilyCard from "src/components/loan-app/FamilyCard";
import DocumentCard from "src/components/loan-app/DocumentCard";

export default function PreviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = queryString.parse(location.search);
    const ID = id as string;
    const [submitForm, setSubmitForm] = useState(false);

    const [loanApp, setLoanApp] = useState<AppLoanRequest>(initLoanAppValue);

    useEffect(() => {
        checkAccess("d8b5626f-4dca-43ad-8e0a-08f87e50c7ab").then((res) => {
            if (!res) {
                notifyWarning("user tidak punya akses menu preview");
                navigate(`/loan-app`);
            }
        });
    }, []);
    useEffect(() => {
        detailAppLoan(id as string).then((res) => {
            console.log("Detail : ", res);
            let found = appStatusIncomplete.some((x) => x === res.statusId);
            if (!found) {
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
                        at: "center top"
                    }
                },
                "success",
                3000
            );
            navigate(`/loan-app`);
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
                <div>
                    <form action="#" onSubmit={handleSubmit}>
                        <Form
                            colCount={1}
                            id="formpreview"
                            showColonAfterLabel={true}
                            validationGroup="loanAppData"
                            formData={loanApp}
                        >
                            <GroupItem
                                colSpan={2}
                                cssClass={"dx-card responsive-paddings next-card"}
                            >
                                <GroupItem caption="Pengajuan" colCount={2}>
                                    <SimpleItem
                                        dataField="loanAmount"
                                        label={{ text: "Jumlah Pinjaman" }}
                                        editorOptions={{ format: "Rp #,##0", readOnly: true }}
                                    ></SimpleItem>
                                    <SimpleItem
                                        dataField="loanTerm"
                                        label={{ text: "Jangka Waktu" }}
                                        editorOptions={{ readOnly: true }}
                                    ></SimpleItem>
                                </GroupItem>
                                <GroupItem caption="Pencairan" colCount={2}>
                                    <SimpleItem
                                        dataField="bankName"
                                        label={{ text: "Bank" }}
                                        editorOptions={{ readOnly: true }}
                                    ></SimpleItem>
                                    <SimpleItem
                                        dataField="bankAccNumber"
                                        label={{ text: "Nomor Rekening" }}
                                        editorOptions={{ readOnly: true }}
                                    ></SimpleItem>
                                </GroupItem>
                                <GroupItem caption="Informasi Tambahan" colCount={2}>
                                    <SimpleItem
                                        dataField="loanPurpose"
                                        label={{ text: "Tujuan Pinjaman" }}
                                        editorOptions={{ readOnly: true }}
                                    ></SimpleItem>
                                    <SimpleItem
                                        dataField="monthlyIncome"
                                        label={{ text: "Penghasilan perbulan" }}
                                        editorOptions={{ format: "Rp #,##0", readOnly: true }}
                                    ></SimpleItem>
                                </GroupItem>
                            </GroupItem>

                            <GroupItem>
                                <FamilyCard appId={ID} disabled />
                            </GroupItem>
                            <GroupItem>
                                <DocumentCard appId={ID} disabled />
                            </GroupItem>
                            <GroupItem>
                                <SellingQuestions appId={ID} disabled />
                            </GroupItem>
                            <GroupItem>
                                <NeighbourQuestions appId={ID} disabled />
                            </GroupItem>
                            <GroupItem>
                                <StreetShop appId={ID} disabled />
                            </GroupItem>

                            <GroupItem
                                colSpan={2}
                                cssClass={"dx-card responsive-paddings next-card"}
                            >
                                <GroupItem caption={"Custom Data"} colCount={2}>
                                    <DataGrid
                                        dataSource={loanApp.customData}
                                        remoteOperations={true}
                                        columnAutoWidth={true}
                                        wordWrapEnabled={false}
                                        showBorders={true}
                                        dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                                        repaintChangesOnly={true}
                                    >
                                        <Scrolling showScrollbar={"always"} />
                                        <FilterRow visible={true} />
                                        <Column dataField={"no"} caption={"No."} width={70} />
                                        <Column dataField={"name"} caption={"Name"} />
                                        <Column dataField={"value"} caption={"Value"} />
                                        <Paging defaultPageSize={50} />
                                        <Pager
                                            showPageSizeSelector={true}
                                            showInfo={true}
                                            allowedPageSizes={[10, 50, 100]}
                                        />
                                    </DataGrid>
                                </GroupItem>
                            </GroupItem>
                            <GroupItem
                                colSpan={2}
                                cssClass={"dx-card responsive-paddings next-card"}
                            >
                                <GroupItem colCount={2}>
                                    <SimpleItem
                                        dataField="debitTransaction"
                                        label={{ text: "Debit Transaksi" }}
                                        editorOptions={{ format: "Rp #,##0", readOnly: true }}
                                    ></SimpleItem>
                                    <SimpleItem
                                        dataField="creditTransaction"
                                        label={{ text: "Kredit Transaksi" }}
                                        editorOptions={{ format: "Rp #,##0", readOnly: true }}
                                    ></SimpleItem>
                                    <SimpleItem
                                        dataField="handwrittenSalesBook"
                                        label={{ text: "Handwritten Sales book" }}
                                        editorOptions={{ readOnly: true }}
                                    ></SimpleItem>
                                </GroupItem>
                                {loanApp.incomeProof && (
                                    <GroupItem caption={"Income proof"} colCount={1}>
                                        <SimpleItem>
                                            {loanApp.incomeProof.fileType.includes("image/") ? (
                                                <img
                                                    id="dropzone-ktp"
                                                    src={getFileBase64(
                                                        loanApp.incomeProof.fileType,
                                                        loanApp.incomeProof.fileContent
                                                    )}
                                                    alt="ktp"
                                                    width={"50%"}
                                                />
                                            ) : (
                                                <PdfViewer
                                                    url={getFileBase64(
                                                        loanApp.incomeProof.fileType,
                                                        loanApp.incomeProof.fileContent
                                                    )}
                                                />
                                            )}
                                        </SimpleItem>
                                    </GroupItem>
                                )}
                            </GroupItem>
                        </Form>
                    </form>
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
