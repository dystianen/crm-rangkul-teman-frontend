import { Popup } from "devextreme-react";
import { Button } from "devextreme-react/button";
import "devextreme-react/date-box";
import "devextreme-react/file-uploader";
import Form, {
  ButtonItem,
  GroupItem,
  PatternRule,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import { LoadPanel } from "devextreme-react/load-panel";
import DataSource from "devextreme/data/data_source";
import notify from "devextreme/ui/notify";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import {
  checkAccess,
  checkStatusSigning,
  createAppLoanOnboardingStep1,
  detailAppLoan,
  getListBank,
  getLoanPurpose,
  getUnsignedDoc,
  loanTermStore
} from "src/api/apploan";
import { selectBoxOptions } from "src/api/contact";
import Loader from "src/components/loader";
import {
  AppLoanOnboardingStep1Request,
  AppLoanRequest,
  initLoanOnboardingStep1Value
} from "src/interfaces/appLoanOnboarding";
import { store } from "src/store/store";
import "./loan-app.scss";

export default function Step1Page() {
  const navigate = useNavigate();
  const { loanapp } = store.getState();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const idData = id as string;
  const [onboardingLoan, setOnboardingLoan] = useState<AppLoanOnboardingStep1Request>(
    initLoanOnboardingStep1Value
  );
  const [submitForm, setSubmitForm] = useState(false);
  const [loadingDownloadBtn, setLoadingDownloadBtn] = useState(false);
  const [isShowWaitingPopup, setShowWaitingPopup] = useState(false);
  const [isDisableButtonNext, setDisableButtonNext] = useState(false);

  const formRef = useRef<Form>(null);

  useEffect(() => {
    detailAppLoan(idData).then((res) => {
      const data = res as AppLoanRequest;
      const map = {
        amount: data.loanAmount,
        termId: data.loanTermId,
        bankId: data.bankId,
        bankAccNumber: data.bankAccNumber,
        purposeId: data.loanPurposeId,
        monthlyIncome: data.monthlyIncome
      };
      setOnboardingLoan(map);
    });

    const handleCheck = (intervalId: NodeJS.Timeout) => {
      checkStatusSigning(idData).then((res) => {
        setShowWaitingPopup(res);
        setDisableButtonNext(res);

        if (!res) {
          clearInterval(intervalId);
        }
      });
    };

    const intervalId = setInterval(() => {
      handleCheck(intervalId);
    }, 15000);

    handleCheck(intervalId);

    return () => clearInterval(intervalId);
  }, [idData]);

  useEffect(() => {
    setOnboardingLoan({
      amount: loanapp.loanappStep1.amount,
      termId: loanapp.loanappStep1.termId,
      bankId: loanapp.loanappStep1.bankId,
      bankAccNumber: loanapp.loanappStep1.bankAccNumber,
      purposeId: loanapp.loanappStep1.purposeId,
      monthlyIncome: loanapp.loanappStep1.monthlyIncome
    });
  }, [loanapp]);

  const loanTerm = selectBoxOptions(new DataSource(loanTermStore(id as string)), "Pilih term");
  const listBank = selectBoxOptions(new DataSource(getListBank), "Pilih bank");
  const listLoanPurpose = selectBoxOptions(new DataSource(getLoanPurpose), "Pilih tujuan pinjaman");

  const downloadUnsigned = (e: any) => {
    setLoadingDownloadBtn(true);
    getUnsignedDoc(id as any)
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
    createAppLoanOnboardingStep1(id as string, onboardingLoan).then(
      () => {
        checkAccess("0c0983ad-20b2-446d-8462-328aa64915f7").then((res) => {
          if (res) {
            navigate(`/loan-app/create/step/2?id=${id}`);
          } else {
            notify(
              {
                message: "Berhasil submit data",
                position: {
                  my: "center top",
                  at: "center top"
                }
              },
              "success",
              15000
            );
            navigate(`/loan-app`);
          }
        });
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

  const onFieldDataChanged = (evt: any) => {
    // @ts-expect-error
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 15px 0"
        }}
      >
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
                  label={{ text: "Jumlah Pinjaman" }}
                  editorType="dxNumberBox"
                  editorOptions={{ format: "Rp #,##0.00" }}
                >
                  <RequiredRule message="Jumlah Pinjaman is required" />
                  <PatternRule message="hanya angka" pattern={/^[0-9]+$/} />
                </SimpleItem>
                <SimpleItem
                  dataField="termId"
                  editorType="dxSelectBox"
                  editorOptions={loanTerm}
                  label={{ text: "Jangka waktu" }}
                >
                  <RequiredRule message="Jangka waktu wajib diisi" />
                </SimpleItem>
              </GroupItem>

              <GroupItem caption="Pencairan" colCount={2}>
                <SimpleItem
                  dataField="bankId"
                  editorType="dxSelectBox"
                  editorOptions={listBank}
                  label={{ text: "Bank" }}
                >
                  <RequiredRule message="Bank wajib diisi" />
                </SimpleItem>
                <SimpleItem dataField="bankAccNumber" label={{ text: "Nomor Rekening" }}>
                  <RequiredRule message="Nomor rekening wajib diisi" />
                </SimpleItem>
              </GroupItem>

              <GroupItem caption="Informasi tambahan" colCount={2}>
                <SimpleItem
                  dataField="purposeId"
                  editorType="dxSelectBox"
                  editorOptions={listLoanPurpose}
                  label={{ text: "Tujuan pinjaman" }}
                >
                  <RequiredRule message="Tujuan pinjaman wajib diisi" />
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
                    }
                  }}
                />
                <ButtonItem
                  horizontalAlignment="right"
                  buttonOptions={{
                    text: "Lanjutkan",
                    type: "default",
                    useSubmitBehavior: true,
                    disabled: isDisableButtonNext
                  }}
                />
              </GroupItem>
            </GroupItem>
          </Form>
        </form>
      </div>

      <Popup width={360} height={"auto"} visible={isShowWaitingPopup} showTitle={false}>
        <div className="wrapper-popup-waiting">
          <Loader />
          <h5 className="title">Mohon tunggu penandatanganan perjanjian sedang diproses</h5>
          <Button text="Tutup" type="normal" onClick={() => setShowWaitingPopup(false)} />
        </div>
      </Popup>
    </>
  );
}
