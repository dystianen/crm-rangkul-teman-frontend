import { Button, DataGrid, LoadPanel } from "devextreme-react";
import { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme-react/date-box";
import "devextreme-react/file-uploader";
import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { checkAccess, detailAppLoan, submitAppLoan } from "src/api/apploan";
import BusinessAddress from "src/components/loan-app/BusinessAddress";
import DocumentCard from "src/components/loan-app/DocumentCard";
import FamilyCard from "src/components/loan-app/FamilyCard";
import NeighbourQuestions from "src/components/loan-app/NeighbourQuestions";
import PreviewFile from "src/components/loan-app/PreviewFile";
import SellingQuestions from "src/components/loan-app/SellingQuestions";
import StreetShop from "src/components/loan-app/StreetShop";
import { AppLoanRequest, initLoanAppValue } from "src/interfaces/appLoanOnboarding";
import { appStatusIncomplete } from "../../constants/variableConstata";
import { confirmNotify, notifyWarning } from "../../utils/devExtremeUtils";
import { ApprovalHistory } from "../approval1-app/ApprovalHistory";
import "./loan-app.scss";
import { SectionName } from "./step-2";

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

  const componentsMap: Record<SectionName, (id: string) => JSX.Element> = {
    FAMILY_CARD: (id) => <FamilyCard appId={id} />,
    DOCUMENTS: (id) => <DocumentCard appId={id} />,
    SELLING_QUESTIONS: (id) => <SellingQuestions appId={id} />,
    NEIGHBOUR_QUESTIONS: (id) => <NeighbourQuestions appId={id} />,
    BUSINESS_ADDRESS: (id) => <BusinessAddress appId={id} />,
    FINANCIAL_DETAIL: () => (
      <GroupItem colSpan={2}>
        <GroupItem colCount={2}>
          <SimpleItem
            dataField="debitTransaction"
            label={{ text: "Outcome" }}
            editorOptions={{ format: "Rp #,##0", readOnly: true }}
          />
          <SimpleItem
            dataField="creditTransaction"
            label={{ text: "Income" }}
            editorOptions={{ format: "Rp #,##0", readOnly: true }}
          />
          <SimpleItem
            dataField="handwrittenSalesBook"
            label={{ text: "Handwritten Sales book" }}
            editorOptions={{ readOnly: true }}
          />
        </GroupItem>
        <GroupItem visible={loanApp.incomeProof !== null} colCount={1}>
          <SimpleItem>
            <PreviewFile file={loanApp.incomeProof} />
          </SimpleItem>
        </GroupItem>
      </GroupItem>
    )
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
              <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings"}>
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

              {loanApp.items?.map(({ name, mandatory }) => {
                if (!mandatory) return null;
                const Component = componentsMap[name];
                if (!Component) return null;

                return (
                  <GroupItem key={name} cssClass={"dx-card responsive-paddings next-card"}>
                    {Component(ID)}
                  </GroupItem>
                );
              })}

              <GroupItem cssClass={"dx-card responsive-paddings next-card"}>
                <StreetShop appId={ID} disabled />
              </GroupItem>

              <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
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

              <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                <GroupItem cssClass={"custom-tabs-step2"}>
                  <ApprovalHistory id={ID} />
                </GroupItem>
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
            onClick={(evt: any) => {
              confirmNotify(
                "<i>Anda yakin melanjutkan proses ini?</i>",
                "Konfirmasi Submit Aplikasi"
              ).then((dialogResult: any) => {
                if (dialogResult) {
                  handleSubmit(evt);
                }
              });

              evt.event && evt.event.preventDefault();
            }}
          />
        </div>
      </div>
    </>
  );
}
