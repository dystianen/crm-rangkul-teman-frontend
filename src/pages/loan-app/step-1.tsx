import { Client } from "@stomp/stompjs";
import { LoadIndicator, Popup } from "devextreme-react";
import { Button } from "devextreme-react/button";
import "devextreme-react/date-box";
import "devextreme-react/file-uploader";
import Form, {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  PatternRule,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import { LoadPanel } from "devextreme-react/load-panel";
import DataSource from "devextreme/data/data_source";
import queryString from "query-string";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import {
  bankCheckValid,
  changeProduct,
  createAppLoanOnboardingStep1,
  createCommodity,
  detailAppLoan,
  getActiveProductByBranch,
  getDetailCommodity,
  getListBank,
  getListCommodity,
  getLoanPurpose,
  getUnsignedDoc, loanTermStore,
  processCancel
} from "src/api/apploan";
import { selectBoxOptions } from "src/api/contact";
import Loader from "src/components/loader";
import PopupMessage from "src/components/popup-message";
import {
  AppLoanOnboardingStep1Request,
  initLoanOnboardingStep1Value
} from "src/interfaces/appLoanOnboarding";
import { store } from "src/store/store";
import { notifyError, notifySuccess, notifyWarning } from "../../utils/devExtremeUtils";
import { ApprovalHistory } from "../approval1-app/ApprovalHistory";
import "./loan-app.scss";

export default function Step1Page() {
  const navigate = useNavigate();
  const { loanapp } = store.getState();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const idData = id as string;
  const [disableField, setDisableField] = useState(true);
  const [onboardingLoan, setOnboardingLoan] = useState<AppLoanOnboardingStep1Request>(
    initLoanOnboardingStep1Value
  );
  const [submitForm, setSubmitForm] = useState(false);
  const [loadingDownloadBtn, setLoadingDownloadBtn] = useState(false);
  const [isShowWaitingPopup, setShowWaitingPopup] = useState(false);
  const [isDisableButtonNext, setDisableButtonNext] = useState(true);
  const [isDableBankIdBankAccNumber, setDisableBankIdBankAccNumber] = useState(false);
  const formRef = useRef<Form>(null);
  const [waitingToReconnect, setWaitingToReconnect] = useState<boolean>(false);
  const [isShowPopupMessage, setShowPopupMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [url, setUrl] = useState("");
  const [productComboOptions, setComboProductOptions] = useState<any>({});
  const [loanTerm, setLoanTerm] = useState({});

  const handleCheckBankAccount = (e: any) => {
    console.log("handle check bank account ", e, onboardingLoan);
    if (typeof onboardingLoan.bankId === "undefined") {
      notifyWarning("belum memilih bank!!");
      e.event.preventDefault();
      return;
    }
    if (typeof onboardingLoan.bankAccNumber === "undefined") {
      notifyWarning("belum mengisi nomor rekening!!");
      e.event.preventDefault();
      return;
    }
    if (onboardingLoan.bankId == null || onboardingLoan.bankAccNumber == null) {
      notifyWarning("pastikan sudah memilih bank dan mengisi nomor rekening!!");
      e.event.preventDefault();
      return;
    }

    sendBankCheck();
  };

  const handleGetDetail = useCallback(async () => {
    const [loanRes, commodityRes] = await Promise.all([
      detailAppLoan(idData),
      getDetailCommodity(idData)
    ]);

    if (loanRes.branchId) {
      setComboProductOptions(
        selectBoxOptions(
          new DataSource(getActiveProductByBranch(loanRes.branchId)),
          "Select product"
        )
      );
    }
    if(loanRes.productId){
      setDisableField(false);
    }
    setLoanTerm(selectBoxOptions(new DataSource(loanTermStore(idData)), "Pilih term"));
    
    const map = {
      productId: loanRes.productId,
      amount: loanRes.loanAmount,
      termId: loanRes.loanTermId,
      bankId: loanRes.bankId,
      bankAccNumber: loanRes.bankAccNumber,
      purposeId: loanRes.loanPurposeId,
      monthlyIncome: loanRes.monthlyIncome,
      commodityId: commodityRes?.type?.id ?? ""
    };
    
    setOnboardingLoan(map);
    if (typeof loanRes?.bankCheck !== "undefined") {
      setDisableButtonNext(!loanRes.bankCheck);
    } else {
      setDisableButtonNext(true);
    }
  }, [idData]);

  useEffect(() => {
    handleGetDetail();
  }, [handleGetDetail]);

  useEffect(() => {
    setOnboardingLoan({
      amount: loanapp.loanappStep1.amount,
      termId: loanapp.loanappStep1.termId,
      bankId: loanapp.loanappStep1.bankId,
      bankAccNumber: loanapp.loanappStep1.bankAccNumber,
      purposeId: loanapp.loanappStep1.purposeId,
      monthlyIncome: loanapp.loanappStep1.monthlyIncome,
      commodityId: ""
    });
  }, [loanapp]);
  
  const listBank = selectBoxOptions(new DataSource(getListBank), "Pilih bank");
  const listLoanPurpose = selectBoxOptions(new DataSource(getLoanPurpose), "Pilih tujuan pinjaman");
  const listCommodity = selectBoxOptions(new DataSource(getListCommodity), "Pilih commodity");

  const downloadUnsigned = () => {
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
        notifyWarning(e?.message);
      })
      .finally(() => setLoadingDownloadBtn(false));
  };

  const submitCancel = () => {
    const appId = String(id);

    processCancel(appId).then((res) => {
      setShowWaitingPopup(false);
    });
  };

  const handleSubmitCommodity = () => {
    const typeId = onboardingLoan.commodityId;
    const payload = {
      typeId
    };

    createCommodity(idData, payload);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitForm(true);
    const form = formRef.current!.instance;
    const { isValid } = form.validate();
    if (isValid) {
      handleSubmitCommodity();
      createAppLoanOnboardingStep1(id as string, onboardingLoan)
        .then(
          (res) => {
            const { showPopup, message, url } = res;
            if (showPopup) {
              setShowPopupMessage(showPopup);
              setPopupMessage(message);
              setUrl(url);
            } else {
              navigate(url);
            }
          },
          (error) => {
            setSubmitForm(false);
            notifyError(error);
          }
        )
        .finally(() => setSubmitForm(false));
    }
    e.preventDefault();
  };

  const onFieldDataChanged = (evt: any) => {
    const { dataField, value } = evt;
    if (dataField === "productId" && value != null) {
      changeProduct({
        appId: idData,
        productId: value
      }).then((res) => {
        setLoanTerm(selectBoxOptions(new DataSource(res), "Pilih term"));
        setDisableField(false);
        onboardingLoan["amount"] = 0;
        onboardingLoan["termId"] = "";
      }).catch((e) => {
        notifyError(e?.message);
      });
      return;
    }

    onboardingLoan[dataField] = value;
  };

  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    var socket = new SockJS(`${process.env.REACT_APP_BACKEND}api/bankAccountLive`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
      onDisconnect: () => {
        if (waitingToReconnect) {
          return;
        }
        setWaitingToReconnect(true);
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe("/api/bankAccountResult", (response) => {
          console.log("Received message:", response.body);
          const res = JSON.parse(response.body);
          if (res.appId === id) {
            if (res.isWaiting) {
              setDisableBankIdBankAccNumber(true);
            } else {
              setDisableBankIdBankAccNumber(false);

              if (res.success) {
                if (res?.error) {
                  notifyWarning(res.message);
                } else {
                  notifySuccess(res.message);
                }
                setDisableButtonNext(false);
              } else {
                notifyError(res.message);
                setDisableButtonNext(true);
              }
            }
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      }
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      // Dereference, so it will set up next time
      console.log("Cleanup");
      stompClientRef.current = null;
      stompClient.deactivate();
    };
  }, [id, waitingToReconnect]);

  const sendBankCheck = () => {
    const payload = {
      appId: id,
      bankId: onboardingLoan.bankId,
      bankAccountNumber: onboardingLoan.bankAccNumber
    };
    console.log("Sending bank account check:", payload);
    bankCheckValid(payload).then((rest) => {
      console.log("submit bankchecking", rest);
      setDisableBankIdBankAccNumber(rest?.isWaiting);
      setDisableButtonNext(rest?.isWaiting);
    });
  };

  const handleConfirmPopupMessage = useCallback(() => {
    if (url.includes(location.pathname)) {
      setShowPopupMessage(false);
    } else {
      navigate(url);
    }
  }, [location, navigate, url]);

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
          onClick={downloadUnsigned}
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
            <GroupItem colCount={2} cssClass={"dx-card responsive-paddings next-card"}>
              <SimpleItem
                colSpan={1}
                dataField="productId"
                label={{ text: "Product" }}
                editorType="dxSelectBox"
                editorOptions={productComboOptions}
              >
                <RequiredRule message="Product is required" />
              </SimpleItem>
            </GroupItem>
            <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
              <GroupItem caption="Pengajuan" colCount={2}>
                <SimpleItem
                  dataField="amount"
                  label={{ text: "Jumlah Pinjaman" }}
                  editorType="dxNumberBox"
                  editorOptions={{ format: "Rp #,##0.00", disabled: disableField}}
                  
                >
                  <RequiredRule message="Jumlah Pinjaman is required" />
                  <PatternRule message="hanya angka" pattern={/^[0-9]+$/} />
                </SimpleItem>
                <SimpleItem
                  dataField="termId"
                  editorType="dxSelectBox"
                  editorOptions={{...loanTerm, disabled: disableField}}
                  label={{ text: "Jangka waktu" }}
                >
                  <RequiredRule message="Jangka waktu wajib diisi" />
                </SimpleItem>
              </GroupItem>

              <GroupItem caption="Pencairan" colCount={2}>
                <SimpleItem
                  dataField="bankId"
                  editorType="dxSelectBox"
                  editorOptions={{ ...listBank, disabled: isDableBankIdBankAccNumber }}
                  label={{ text: "Bank" }}
                >
                  <RequiredRule message="Bank wajib diisi" />
                </SimpleItem>
                <GroupItem colCount={3}>
                  <SimpleItem
                    colSpan={2}
                    dataField="bankAccNumber"
                    label={{ text: "Nomor Rekening" }}
                    editorOptions={{
                      disabled: isDableBankIdBankAccNumber,
                      onKeyDown: (e: any) => {
                        const key = e.event.key;
                        e.value = String.fromCharCode(e.event.keyCode);
                        let forbiddenChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
                        if (forbiddenChars.includes(key)) e.event.preventDefault();
                        if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                          e.event.preventDefault();
                      }
                    }}
                  >
                    <RequiredRule message="Nomor rekening wajib diisi" />
                    <PatternRule message="Nomor Rekening hanya boleh angka" pattern={/^[0-9]+$/} />
                  </SimpleItem>
                  <ButtonItem horizontalAlignment={"center"} verticalAlignment={"center"}>
                    <ButtonOptions
                      type="default"
                      width={"100%"}
                      disabled={isDableBankIdBankAccNumber}
                      onClick={handleCheckBankAccount}
                    >
                      <div className="button-options">
                        <LoadIndicator
                          width="20px"
                          height="20px"
                          visible={isDableBankIdBankAccNumber}
                        />
                        <span className="dx-button-text">Periksa</span>
                      </div>
                    </ButtonOptions>
                  </ButtonItem>
                </GroupItem>
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
                <SimpleItem
                  dataField="commodityId"
                  editorType="dxSelectBox"
                  editorOptions={listCommodity}
                  label={{ text: "Commodity" }}
                >
                  <RequiredRule message="Commodity wajib diisi" />
                </SimpleItem>
              </GroupItem>
            </GroupItem>

            <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
              <GroupItem cssClass={"custom-tabs-step2"}>
                <ApprovalHistory id={id} />
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

          <div style={{ display: "flex", gap: "10px" }}>
            <Button text="Kembali" type="default" onClick={() => navigate("/loan-app")} />
            <Button text="Batalkan" type="normal" onClick={submitCancel} />
          </div>
        </div>
      </Popup>

      <PopupMessage
        visible={isShowPopupMessage}
        message={popupMessage}
        handleConfirm={handleConfirmPopupMessage}
      />
    </>
  );
}
