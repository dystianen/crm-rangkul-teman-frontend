import { LoadPanel } from "devextreme-react";
import { Button } from "devextreme-react/button";
import DataGrid, {
  Column,
  Editing,
  Form as FormGrid,
  Item,
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
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import Resizer from "react-image-file-resizer";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import {
  checkAccess,
  createAppLoanOnboardingStep2,
  detailAppLoan,
  getSignedDoc
} from "src/api/apploan";
import FamilyCard from "src/components/loan-app/FamilyCard";
import NeighbourQuestions from "src/components/loan-app/NeighbourQuestions";
import SellingQuestions from "src/components/loan-app/SellingQuestions";
import StreetShop from "src/components/loan-app/StreetShop";
import PdfViewer from "src/components/pdf-viewer/PdfViewer";
import { getFileBase64 } from "../../api/helper";
import { notifyWarning } from "../../utils/devExtremeUtils";
import "./loan-app.scss";
import {statusApp} from "../../constants/variableConstata";

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
  const [submitForm, setSubmitForm] = useState(false);
  const [loadingDownloadBtn, setLoadingDownloadBtn] = useState(false);

  useEffect(() => {
    detailAppLoan(ID).then((res) => {
      const data = res as any;
      
      console.log("data app: ", data);
      if(!data.privyEnabled && data.statusId === statusApp.unsigned) {
        navigate(`/loan-app/detail/upload-signed?id=${ID}`);
      }
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
    });
  }, [ID]);

  useEffect(() => {
    checkAccess("0c0983ad-20b2-446d-8462-328aa64915f7").then((res) => {
      if (!res) {
        navigate(`/loan-app`);
        notifyWarning("User tidak memilik akses ke menu step 2");
      }
    });
  }, []);

  const downloadDocSigned = () => {
    setLoadingDownloadBtn(true);
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
      })
      .finally(() => setLoadingDownloadBtn(false));
  };

  const handleSubmit = (e: any) => {
    setSubmitForm(true);
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
        form.resetValues();
        navigate(`/loan-app/create/preview?id=${id}`);
      },
      (error) => {
        setSubmitForm(false);
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
    e.preventDefault();
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 15px 0"
        }}
      >
        <h2>Step 2</h2>
        <Button
          text="Download Signed Contract"
          type="success"
          stylingMode="contained"
          disabled={loadingDownloadBtn}
          onClick={downloadDocSigned}
        />
      </div>
      <div className={"content-block"}>
        <FamilyCard appId={ID} />

        <div className={"dx-card responsive-paddings next-card"}>
          <h3>Documents</h3>
          <DataGrid
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
                <SimpleItem dataField={"fileType"} editorType="dxSelectBox">
                  <RequiredRule message="File type is required" />
                </SimpleItem>
                <SimpleItem dataField={"value"} editorType={"dxFileUploader" as any}>
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
        </div>

        <SellingQuestions appId={ID} />

        <NeighbourQuestions appId={ID} />

        <StreetShop appId={ID} />

        <div className={"dx-card responsive-paddings next-card"}>
          <h3>Custom Data</h3>
          <DataGrid
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
        </div>

        <form action="validate" onSubmit={handleSubmit} className={"next-card"}>
          <Form
            ref={formRef}
            colCount={1}
            id="form"
            showColonAfterLabel={true}
            validationGroup="incomeProofData"
            formData={onStep2Loan}
            onFieldDataChanged={onFieldDataChanged}
          >
            <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
              <GroupItem caption="Financial Detail" colCount={2}>
                <SimpleItem
                  dataField="monthlyIncome"
                  label={{ text: "Penghasilan perbulan" }}
                  editorType="dxNumberBox"
                  editorOptions={{ format: "Rp #,##0.00" }}
                >
                  <RequiredRule message="Penghasilan perbulan wajib diisi" />
                  <PatternRule message="hanya boleh angka" pattern={/^[0-9]+$/} />
                </SimpleItem>
                <SimpleItem
                  dataField="handwrittenSalesBook"
                  label={{ text: "Handwritten Sales book" }}
                  editorType="dxCheckBox"
                />
                <SimpleItem
                  dataField="debitTransaction"
                  label={{ text: "Debit Transaksi" }}
                  editorType="dxNumberBox"
                  editorOptions={{ format: "Rp #,##0.00" }}
                >
                  <RequiredRule message="Debit transaksi wajib diisi" />
                  <PatternRule message="hanya boleh angka" pattern={/^[0-9]+$/} />
                </SimpleItem>
                <SimpleItem
                  dataField="creditTransaction"
                  label={{ text: "Kredit Transaksi" }}
                  editorType="dxNumberBox"
                  editorOptions={{ format: "Rp #,##0.00" }}
                >
                  <RequiredRule message="Kredit transaksi wajib diisi" />
                  <PatternRule message="hanya boleh angka" pattern={/^[0-9]+$/} />
                </SimpleItem>
                <SimpleItem
                  dataField="incomeProof"
                  editorType={"dxFileUploader" as any}
                  editorOptions={uploadKtpOptions}
                  label={{ text: "File" }}
                ></SimpleItem>
              </GroupItem>
              <GroupItem>
                {incomeProof && (
                  <Item>
                    {fileType.includes("image/") ? (
                      <img id="dropzone-ktp" src={incomeProof} alt="income-proof" width={"50%"} />
                    ) : (
                      <PdfViewer url={incomeProof} />
                    )}
                  </Item>
                )}
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
                    useSubmitBehavior: true
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
