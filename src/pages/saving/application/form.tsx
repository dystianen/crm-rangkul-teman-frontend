import { Client } from "@stomp/stompjs";
import { LoadIndicator } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import DataSource from "devextreme/data/data_source";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { bankCheckValid, checkAccess, getListBank } from "src/api/apploan";
import { selectBoxOptions } from "src/api/contact";
import {
  getDetailSavingApplication,
  listProductApplicationTerm,
  submitSavingApplication
} from "src/api/saving";
import { TResSavingApplication } from "src/api/types/ISaving";
import LoadingPage from "src/components/load-panel";
import { backofficeAccess } from "src/constants/variableConstata";
import { initSavingForm } from "src/interfaces/ISaving";
import { notifyError, notifySuccess, notifyWarning } from "src/utils/devExtremeUtils";
import { allowOnlyNumbers } from "src/utils/helpers";

const FormSavingApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);

  const [formData, setFormData] = useState<TResSavingApplication>(initSavingForm);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isDableBankIdBankAccNumber, setDisableBankIdBankAccNumber] = useState(false);
  const [isDisableButtonSubmit, setDisableButtonSubmit] = useState<boolean>(true);
  const [waitingToReconnect, setWaitingToReconnect] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const isReadonly = !formData.isEditable;
  const isDraft = formData.status === "Draft";

  useEffect(() => {
    setLoadingPage(true);
    getDetailSavingApplication(ID)
      .then((res) => {
        setFormData(res);
        if (res.bankAccountIsVerified) {
          setDisableButtonSubmit(false);
        }
      })
      .finally(() => {
        setLoadingPage(false);
      });
  }, [ID]);

  const listBank = selectBoxOptions(new DataSource(getListBank), "Pilih bank");
  const savingTermOptions = selectBoxOptions(
    new DataSource(listProductApplicationTerm),
    "Select product saving term"
  );

  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    checkAccess(backofficeAccess.backoffice_application_saving).then((res) => {
      if (!res) navigate("/saving/application");
    });
  }, [navigate]);

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
          if (res.appId === ID) {
            if (res.isWaiting) {
              setDisableBankIdBankAccNumber(true);
            } else {
              setDisableBankIdBankAccNumber(false);

              if (res.success) {
                setFormData((prev) => ({
                  ...prev,
                  bankAccountIsVerified: res.success,
                  bankAccountVerificationId: res.bankAccountHistoryId
                }));

                if (res?.error) {
                  notifyWarning(res.message);
                } else {
                  notifySuccess(res.message);
                }
                setDisableButtonSubmit(false);
              } else {
                notifyError(res.message);
                setDisableButtonSubmit(true);
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
  }, [ID, waitingToReconnect]);

  const sendBankCheck = () => {
    const payload = {
      appId: ID,
      bankId: formData.bankId,
      bankAccountNumber: formData.bankAccountNumber
    };

    bankCheckValid(payload).then((res) => {
      setDisableBankIdBankAccNumber(res.isWaiting);
    });
  };

  const handleCheckBankAccount = (e: any) => {
    if (typeof formData.bankId === "undefined") {
      notifyWarning("belum memilih bank!!");
      e.event.preventDefault();
      return;
    }
    if (typeof formData.bankAccountNumber === "undefined") {
      notifyWarning("belum mengisi nomor rekening!!");
      e.event.preventDefault();
      return;
    }
    if (formData.bankId == null || formData.bankAccountNumber == null) {
      notifyWarning("pastikan sudah memilih bank dan mengisi nomor rekening!!");
      e.event.preventDefault();
      return;
    }

    sendBankCheck();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const onFieldDataChanged = (evt: any) => {
    const { dataField, value } = evt;

    setFormData((prev) => ({
      ...prev,
      [dataField]: value
    }));
  };

  const handleSubmit = () => {
    setIsLoadingSubmit(true);
    const {
      amount,
      termMonth,
      bankId,
      bankAccountNumber,
      bankAccountIsVerified,
      bankAccountVerificationId
    } = formData;

    const payload = {
      id: ID,
      amount,
      termMonth,
      bankId,
      bankAccountNumber,
      bankAccountIsVerified,
      bankAccountVerificationId
    };
    submitSavingApplication(payload)
      .then(() => {
        navigate("/saving/application");
      })
      .catch((err) => {
        const { detail } = err.options;
        notifyError(detail);
      })
      .finally(() => {
        setIsLoadingSubmit(false);
      });
  };

  return (
    <>
      <LoadingPage visible={loadingPage} />

      <div className="title-detail">
        <h2 className={"content-block"}>Pengajuan Simpanan</h2>
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
        <div className={"form__tabs form-container"}>
          <Form
            colCount={1}
            id="form"
            formData={formData}
            onFieldDataChanged={onFieldDataChanged}
            labelLocation="left"
          >
            <GroupItem>
              <GroupItem caption={"Detail Anggota"} cssClass="dx-card responsive-paddings">
                <GroupItem colCount={1}>
                  <SimpleItem
                    dataField="contactName"
                    label={{ text: "Nama Anggota" }}
                    editorOptions={{
                      readOnly: true
                    }}
                  />
                  <SimpleItem
                    dataField="contactPhone"
                    label={{ text: "No. HP" }}
                    editorOptions={{
                      readOnly: true,
                      mask: "+00 (X00) 000-0000",
                      maskRules: { X: /[02-9]/ }
                    }}
                  />
                  <SimpleItem
                    dataField="idCardNumber"
                    editorType="dxTextBox"
                    label={{ text: "Nomor KTP" }}
                    editorOptions={{
                      readOnly: true
                    }}
                  />
                </GroupItem>
              </GroupItem>

              <GroupItem
                caption={"Detail Simpanan"}
                colCount={1}
                cssClass="dx-card responsive-paddings next-card"
              >
                <SimpleItem
                  dataField="seqId"
                  label={{ text: "#Nomor Pengajuan" }}
                  visible={isReadonly}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="status"
                  label={{ text: "Status Pengajuan" }}
                  visible={!isDraft}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="createdOn"
                  editorType="dxDateBox"
                  label={{ text: "Tanggal Pengajuan" }}
                  visible={!isDraft}
                  editorOptions={{
                    displayFormat: "dd MMM yyyy",
                    type: "datetime",
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="contactVa"
                  label={{ text: "Nomor Virtual Account" }}
                  visible={!isDraft}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="amount"
                  label={{ text: "Jumlah Simpanan" }}
                  editorOptions={{
                    format: "Rp #,##0.00",
                    readOnly: isReadonly
                  }}
                  editorType="dxNumberBox"
                />
                <SimpleItem
                  dataField="termMonth"
                  editorType="dxSelectBox"
                  editorOptions={{ ...savingTermOptions, readOnly: isReadonly }}
                  label={{ text: "Jangka Waktu" }}
                />
              </GroupItem>

              <GroupItem
                caption={"Pencairan Simpanan"}
                colCount={1}
                cssClass="dx-card responsive-paddings next-card"
              >
                <SimpleItem
                  dataField="bankId"
                  editorType="dxSelectBox"
                  editorOptions={{
                    ...listBank,
                    disabled: isDableBankIdBankAccNumber,
                    readOnly: isReadonly
                  }}
                  label={{ text: "Bank" }}
                />
                <GroupItem colCount={5} cssClass="m0">
                  <SimpleItem
                    colSpan={isReadonly ? 5 : 4}
                    dataField="bankAccountNumber"
                    label={{ text: "Nomor Rekening" }}
                    editorOptions={{
                      disabled: isDableBankIdBankAccNumber,
                      readOnly: isReadonly,
                      onKeyDown: (e: any) => allowOnlyNumbers(e.event)
                    }}
                  />
                  <ButtonItem
                    horizontalAlignment={"center"}
                    verticalAlignment={"center"}
                    visible={!isReadonly}
                  >
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
            </GroupItem>
            <GroupItem visible={!isReadonly} colCountByScreen={{ xs: 4, sm: 8, md: 10, lg: 8 }}>
              <ButtonItem horizontalAlignment="left">
                <ButtonOptions width={"100%"} onClick={handleBack}>
                  <span className="dx-button-text">Batal</span>
                </ButtonOptions>
              </ButtonItem>

              <ButtonItem horizontalAlignment="left">
                <ButtonOptions
                  type="default"
                  width={"100%"}
                  disabled={isDisableButtonSubmit}
                  onClick={handleSubmit}
                >
                  <div className="button-options">
                    <LoadIndicator width="20px" height="20px" visible={isLoadingSubmit} />
                    <span className="dx-button-text">Simpan</span>
                  </div>
                </ButtonOptions>
              </ButtonItem>
            </GroupItem>
          </Form>
        </div>
      </div>
    </>
  );
};

export default FormSavingApplication;
