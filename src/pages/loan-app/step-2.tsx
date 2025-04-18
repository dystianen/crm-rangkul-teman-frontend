import { DropDownButton, LoadPanel, Popup } from "devextreme-react";
import { Button } from "devextreme-react/button";
import DataGrid, {
  Column,
  Editing,
  Form as FormGrid,
  Pager,
  Paging,
  Popup as PopGrid
} from "devextreme-react/data-grid";
import "devextreme-react/date-box";
import "devextreme-react/file-uploader";
import Form, {
  ButtonItem,
  GroupItem,
  PatternRule,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import Resizer from "react-image-file-resizer";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import {
  checkAccessStep2,
  createAppLoanOnboardingStep2,
  detailAppLoan,
  fetchCheckPartial,
  fetchStep2Activity,
  getSignedDoc
} from "src/api/apploan";
import BusinessAddress from "src/components/loan-app/BusinessAddress";
import DocumentCard from "src/components/loan-app/DocumentCard";
import FamilyCard from "src/components/loan-app/FamilyCard";
import NeighbourQuestions from "src/components/loan-app/NeighbourQuestions";
import PreviewFile from "src/components/loan-app/PreviewFile";
import SellingQuestions from "src/components/loan-app/SellingQuestions";
import StreetShop from "src/components/loan-app/StreetShop";
import PopupMessage from "src/components/popup-message";
import { getFileBase64 } from "../../api/helper";
import { notifySuccess } from "../../utils/devExtremeUtils";
import { ApprovalHistory } from "../approval1-app/ApprovalHistory";
import "./loan-app.scss";
import { RejectPopup } from "./RejectPopup";

export type SectionName =
  | "FAMILY_CARD"
  | "DOCUMENTS"
  | "SELLING_QUESTIONS"
  | "NEIGHBOUR_QUESTIONS"
  | "BUSINESS_ADDRESS"
  | "FINANCIAL_DETAIL";

export type VisibleSection = {
  name: SectionName;
  mandatory: boolean;
}[];

export default function Step2Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);
  const [incomeProof, setIncomeProof] = useState<any>(undefined);
  const [fileType, setFileType] = useState<string>("");
  const [dataGrid, setDataGrid] = useState<any[]>([]);
  const formRef = useRef<Form>(null);
  const [onStep2Loan, setOnStep2Loan] = useState<any>({
    monthlyIncome: 0,
    handwrittenSalesBook: false,
    debitTransaction: 0,
    creditTransaction: 0
  });
  const [loadingPage, setLoadingPage] = useState(false);
  const [isShowRemainingPopup, setShowRemainingPopup] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [activity, setActivity] = useState<Array<any>>([]);
  const [isShowPopupReject, setShowPopupReject] = useState(false);
  const [isShowPopupMessage, setShowPopupMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [visibleSection, setVisibleSection] = useState<VisibleSection>([]);

  const detailLoanApp = (appId: any) => {
    setLoadingPage(true);
    detailAppLoan(appId).then((res) => {
      const data = res as any;
      const gridStore: any[] = data?.customData || [];
      setDataGrid(gridStore);
      if (data?.incomeProof) {
        setFileType(data.incomeProof.fileType);
        setIncomeProof(getFileBase64(data.incomeProof.fileType, data.incomeProof.fileContent));
      }

      if (typeof data.monthlyIncome !== "undefined") {
        setOnStep2Loan({
          monthlyIncome: data?.monthlyIncome,
          handwrittenSalesBook: data?.handwrittenSalesBook ? data?.handwrittenSalesBook : false,
          debitTransaction: data?.debitTransaction,
          creditTransaction: data?.creditTransaction
        });
      }

      setVisibleSection(res.items);
      setLoadingPage(false);
    });

    fetchCheckPartial(ID).then((res) => {
      setMissingFields(res.messages);
      setShowRemainingPopup(res.opened);
    });
  };

  useEffect(() => {
    detailLoanApp(ID);
    fetchStep2Activity(ID).then(setActivity);
  }, [ID]);

  useEffect(() => {
    checkAccessStep2(ID).then((res) => {
      if (!res.access) {
        setShowPopupMessage(true);
        setPopupMessage(res.message);
      }
    });
  }, [ID, navigate]);

  const downloadDocSigned = () => {
    getSignedDoc(id as any)
      .then((dt) => {
        const link = document.createElement("a");
        link.href = `data:${dt.fileType};base64,${dt.fileContent}`;
        link.target = "_blank";
        link.download = dt.fileName;
        link.click();
      })
      .catch((e) => {
        notify(
          {
            message: e?.message,
            position: {
              my: "center top",
              at: "center top"
            }
          },
          "warning",
          15000
        );
      });
  };

  const handleSubmit = () => {
    setLoadingPage(true);
    const form = formRef.current!.instance;
    const customData =
      dataGrid.length > 0
        ? dataGrid.map((m) => {
            return {
              name: m.name,
              value: m.value
            };
          })
        : [];
    createAppLoanOnboardingStep2(String(id), {
      customData: customData,
      incomeProof: incomeProof ? incomeProof.split(",")[1] : null,
      monthlyIncome: onStep2Loan.monthlyIncome,
      handwrittenSalesBook: onStep2Loan?.handwrittenSalesBook
        ? onStep2Loan?.handwrittenSalesBook
        : false,
      debitTransaction: onStep2Loan?.debitTransaction,
      creditTransaction: onStep2Loan?.creditTransaction
    }).then(
      (res) => {
        setIncomeProof("");
        setDataGrid([]);
        form.clear();
        notifySuccess(res.message);
        setLoadingPage(false);
        detailLoanApp(ID);
        if (res.isCompletedStep) {
          navigate(`/loan-app/create/preview?id=${id}`);
        }
      },
      (error) => {
        setLoadingPage(false);
        notify(
          {
            message: error,
            position: {
              my: "center top",
              at: "center top"
            }
          },
          "error",
          15000
        );
      }
    );
  };

  const onFileChanged = (e: any) => {
    if (e.value.length > 0) {
      try {
        setFileType(e.value[0].type);
        if (fileType.includes("image/")) {
          Resizer.imageFileResizer(
            e.value[0],
            1772,
            1181,
            "JPEG",
            100,
            0,
            (uri) => {
              setIncomeProof(uri);
            },
            "base64",
            900,
            400
          );
        } else {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            setIncomeProof(fileReader.result);
          };
          fileReader.readAsDataURL(e.value[0]);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const uploadKtpOptions = {
    selectButtonText: "Pilih file",
    accept: "application/pdf,image/*",
    uploadMode: "useForm",
    onValueChanged: onFileChanged
  };

  const onFieldDataChanged = (evt: any) => {
    onStep2Loan[evt.dataField] = evt.value;
  };

  const handleConfirmPopupMessage = useCallback(() => {
    navigate("/loan-app");
  }, [navigate]);

  const componentsMap: Record<SectionName, () => JSX.Element> = {
    FAMILY_CARD: () => <FamilyCard appId={ID} />,
    DOCUMENTS: () => <DocumentCard appId={ID} />,
    SELLING_QUESTIONS: () => <SellingQuestions appId={ID} />,
    NEIGHBOUR_QUESTIONS: () => <NeighbourQuestions appId={ID} />,
    BUSINESS_ADDRESS: () => <BusinessAddress appId={ID} />,
    FINANCIAL_DETAIL: () => (
      <GroupItem>
        <GroupItem caption="Financial Detail" colCount={2}>
          <SimpleItem
            dataField="monthlyIncome"
            label={{ text: "Penghasilan perbulan" }}
            editorType="dxNumberBox"
            editorOptions={{ format: "Rp #,##0.00" }}
          >
            <PatternRule message="hanya boleh angka" pattern={/^[0-9]+$/} />
          </SimpleItem>
          <SimpleItem
            dataField="handwrittenSalesBook"
            label={{ text: "Handwritten Sales book" }}
            editorType="dxCheckBox"
          />
          <SimpleItem
            dataField="debitTransaction"
            label={{ text: "Outcome" }}
            editorType="dxNumberBox"
            editorOptions={{ format: "Rp #,##0.00" }}
          >
            <PatternRule message="hanya boleh angka" pattern={/^[0-9]+$/} />
          </SimpleItem>
          <SimpleItem
            dataField="creditTransaction"
            label={{ text: "Income" }}
            editorType="dxNumberBox"
            editorOptions={{ format: "Rp #,##0.00" }}
          >
            <PatternRule message="hanya boleh angka" pattern={/^[0-9]+$/} />
          </SimpleItem>
          <SimpleItem
            dataField="incomeProof"
            editorType={"dxFileUploader" as any}
            editorOptions={uploadKtpOptions}
            label={{ text: "File" }}
          ></SimpleItem>
        </GroupItem>
        <GroupItem visible={incomeProof} colCount={1}>
          <SimpleItem>
            <PreviewFile file={incomeProof} />
          </SimpleItem>
        </GroupItem>
      </GroupItem>
    )
  };

  return (
    <>
      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        visible={loadingPage}
        showIndicator={true}
        shading={true}
        showPane={true}
        hideOnOutsideClick={false}
      />
      <div className="title-detail">
        <h2 className={"content-block"}>Step 2</h2>
        <div>
          <DropDownButton
            useSelectMode={false}
            stylingMode="contained"
            text="Activity"
            dropDownOptions={{
              width: 230
            }}
            items={activity}
            onItemClick={(e) => {
              if (e.itemData === "Download Signed Contract") {
                downloadDocSigned();
              }

              if (e.itemData === "Reject") {
                setShowPopupReject(true);
              }
            }}
            width={230}
          />
        </div>
      </div>
      <div className={"content-block"}>
        <Form
          ref={formRef}
          colCount={1}
          id="form"
          showColonAfterLabel={true}
          validationGroup="incomeProofData"
          formData={onStep2Loan}
          onFieldDataChanged={onFieldDataChanged}
        >
          {visibleSection.map(({ name, mandatory }) => {
            if (!mandatory) return null;
            const Component = componentsMap[name];
            if (!Component) return null;

            return (
              <GroupItem key={name} cssClass={"dx-card responsive-paddings next-card"}>
                {Component()}
              </GroupItem>
            );
          })}

          <GroupItem cssClass={"dx-card responsive-paddings next-card"}>
            <StreetShop appId={ID} />
          </GroupItem>
          <GroupItem cssClass={"dx-card responsive-paddings next-card"}>
            <h3>Custom Data</h3>
            <DataGrid
              loadPanel={{ enabled: false }}
              dataSource={dataGrid}
              columnAutoWidth={true}
              wordWrapEnabled={false}
              showBorders={true}
              dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
              repaintChangesOnly={true}
            >
              <Editing mode="popup" allowUpdating={true} allowAdding={true} allowDeleting={true}>
                <PopGrid title="Custom Data Form" showTitle={true} width={360} height={320} />
                <FormGrid
                  showColonAfterLabel={true}
                  showValidationSummary={true}
                  validationGroup="customedata"
                  colCount={1}
                >
                  <SimpleItem dataField="name">
                    <RequiredRule message="Nama wajib diisi" />
                  </SimpleItem>
                  <SimpleItem dataField={"value"}>
                    <RequiredRule message="Value wajib diisi" />
                  </SimpleItem>
                </FormGrid>
              </Editing>
              <Column
                caption={"No."}
                width={70}
                alignment={"center"}
                cellTemplate={function (container: any, options: any) {
                  const dom = ReactDOM.createRoot(container);
                  dom.render(options.rowIndex + 1);
                }}
              />
              <Column dataField={"name"} caption={"Name"} />
              <Column dataField={"value"} caption={"Value"} />
              <Paging defaultPageSize={50} />
              <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
            </DataGrid>
          </GroupItem>
          <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
            <GroupItem cssClass={"custom-tabs-step2"}>
              <ApprovalHistory id={ID} />
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
                    navigate(`/loan-app/create/step/1?id=${id}&autoNext=false`);
                  }
                }}
              />
              <ButtonItem
                horizontalAlignment="right"
                buttonOptions={{
                  text: "Lanjutkan",
                  type: "default",
                  onClick: handleSubmit
                }}
              />
            </GroupItem>
          </GroupItem>
        </Form>
      </div>

      <Popup width={360} height={"auto"} visible={isShowRemainingPopup} showTitle={false}>
        <div className="wrapper-popup-reminder">
          <h5 className="title">Lengkapi Data Anda</h5>
          <p className="description">
            Beberapa field berikut masih kosong, harap lengkapi sebelum melanjutkan:
          </p>
          <div className="card">
            <ul>
              {missingFields.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <Button
            style={{ marginTop: 16 }}
            text="Tutup"
            type="normal"
            onClick={() => setShowRemainingPopup(false)}
          />
        </div>
      </Popup>

      <RejectPopup
        appId={ID}
        popupVisible={isShowPopupReject}
        hide={() => setShowPopupReject(false)}
      />

      <PopupMessage
        visible={isShowPopupMessage}
        message={popupMessage}
        handleConfirm={handleConfirmPopupMessage}
      />
    </>
  );
}
