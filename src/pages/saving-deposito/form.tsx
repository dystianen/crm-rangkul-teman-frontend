import { Client } from "@stomp/stompjs";
import { LoadIndicator, RadioGroup } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import queryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { bankCheckValid, checkAccess, getListBank } from "src/api/apploan";
import { selectBoxOptions } from "src/api/contact";
import { listProductDepositTerm, submitSavingDeposit } from "src/api/saving_deposit";
import { TReqSavingSubmit } from "src/api/types/ISavingDeposit";
import { backofficeAccess } from "src/constants/variableConstata";
import { initSavingForm } from "src/interfaces/ISavingDeposit";
import { notifyError, notifySuccess, notifyWarning } from "src/utils/devExtremeUtils";

const FormSavingDeposit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);

  const [formData, setFormData] = useState<TReqSavingSubmit>(initSavingForm);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isDableBankIdBankAccNumber, setDisableBankIdBankAccNumber] = useState(false);
  const [isDisableButtonSubmit, setDisableButtonSubmit] = useState<boolean>(true);
  const [waitingToReconnect, setWaitingToReconnect] = useState<boolean>(false);

  const listBank = selectBoxOptions(new DataSource(getListBank), "Pilih bank");
  const depositTermOptions = selectBoxOptions(
    new DataSource(listProductDepositTerm),
    "Select product deposit term"
  );

  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    checkAccess(backofficeAccess.backoffice_application_saving).then((res) => {
      if (!res) navigate("/saving/deposito")
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
          if (res.appId === id) {
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
  }, [id, waitingToReconnect]);

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
    const payload = {
      ...formData,
      id: ID
    };
    submitSavingDeposit(payload)
      .then(() => {
        navigate("/saving/deposito");
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        setIsLoadingSubmit(false);
      });
  };

  const handleRadioChange = (field: keyof TReqSavingSubmit, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const RadioGroupCell = React.memo(
    ({
      dataField,
      value,
      onChange
    }: {
      dataField: keyof TReqSavingSubmit;
      value: boolean | null;
      onChange: (field: keyof TReqSavingSubmit, value: boolean) => void;
    }) => (
      <RadioGroup
        items={[
          { label: "Ya", value: true },
          { label: "Tidak", value: false }
        ]}
        value={value}
        layout="horizontal"
        displayExpr="label"
        valueExpr="value"
        onValueChanged={(e) => onChange(dataField, e.value)}
      />
    )
  );

  return (
    <div className={"content-block"}>
      <div className={"form__tabs dx-card responsive-paddings"}>
        <Form
          colCount={1}
          id="form"
          formData={formData}
          onFieldDataChanged={onFieldDataChanged}
          labelLocation="left"
        >
          <GroupItem caption={"Buat Simpanan Berjangka"}>
            <GroupItem colCount={1}>
              <SimpleItem
                dataField="amount"
                label={{ text: "Jumlah Simpanan" }}
                editorOptions={{
                  format: "Rp #,##0.00"
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="termMonth"
                editorType="dxSelectBox"
                editorOptions={depositTermOptions}
                label={{ text: "Jangka Waktu" }}
              />
            </GroupItem>

            <GroupItem colCount={1}>
              <SimpleItem
                dataField="bankId"
                editorType="dxSelectBox"
                editorOptions={{ ...listBank, disabled: isDableBankIdBankAccNumber }}
                label={{ text: "Bank" }}
              />
              <GroupItem colCount={5}>
                <SimpleItem
                  colSpan={4}
                  dataField="bankAccountNumber"
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
                />
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

              <SimpleItem
                dataField="isDeductSaving"
                label={{ text: "Ambil dari simpanan" }}
                render={() => (
                  <RadioGroupCell
                    dataField="isDeductSaving"
                    value={formData.isDeductSaving}
                    onChange={handleRadioChange}
                  />
                )}
              />
              <SimpleItem
                dataField="isWithdrawOnDue"
                editorType="dxSelectBox"
                label={{ text: "Penarikan saat jatuh tempo" }}
                render={() => (
                  <RadioGroupCell
                    dataField="isWithdrawOnDue"
                    value={formData.isWithdrawOnDue}
                    onChange={handleRadioChange}
                  />
                )}
              />
              <SimpleItem
                dataField="isRenewOnDue"
                editorType="dxSelectBox"
                label={{ text: "Perbarui saat jatuh tempo" }}
                render={() => (
                  <RadioGroupCell
                    dataField="isRenewOnDue"
                    value={formData.isRenewOnDue}
                    onChange={handleRadioChange}
                  />
                )}
              />
            </GroupItem>
          </GroupItem>
          <GroupItem colCountByScreen={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
            <ButtonItem horizontalAlignment="left">
              <ButtonOptions width={"100%"} onClick={handleBack}>
                <span className="dx-button-text">Kembali</span>
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
  );
};

export default FormSavingDeposit;
