import { Client } from "@stomp/stompjs";
import { LoadIndicator } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import { Toast } from "devextreme-react/toast";
import DataSource from "devextreme/data/data_source";
import { FC, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { getListBank } from "src/api/apploan";
import { selectBoxOptions } from "src/api/contact";
import { checkBankAccountByContact, createSavingWithdraw } from "src/api/saving";
import { TResSavingCustomerDetail } from "src/api/types/ISaving";
import { notifyError, notifySuccess, notifyWarning } from "src/utils/devExtremeUtils";
import { allowOnlyNumbers } from "src/utils/helpers";

export const PopupWithdraw: FC<any> = (props) => {
  const { popupVisible, hide, detail, handleSuccess } = props;
  const formRef = useRef<Form>(null);
  const [request, setRequest] = useState<{
    amount: number;
    destBankId: string;
    destBankAccountNumber: string;
  }>({
    amount: 0,
    destBankId: "",
    destBankAccountNumber: ""
  });
  const isReadonlyBank = detail.bankId !== undefined && detail.bankAccountNumber !== undefined;

  const [toastConfig, setToastConfig] = useState<any>({
    isVisible: false,
    type: "info",
    message: ""
  });
  const [formData, setFormData] = useState<TResSavingCustomerDetail>({ ...detail });
  const [isDableBankIdBankAccNumber, setDisableBankIdBankAccNumber] = useState(false);
  const [isDisableButtonSubmit, setDisableButtonSubmit] = useState<boolean>(true);
  const [waitingToReconnect, setWaitingToReconnect] = useState<boolean>(false);

  const listBank = selectBoxOptions(new DataSource(getListBank), "Pilih bank");

  useEffect(() => {
    setFormData({ ...detail });
  }, [popupVisible, detail]);

  const onFormSubmit = (e: any) => {
    setDisableButtonSubmit(true);
    const form = formRef.current!.instance;
    const { amount, destBankId, destBankAccountNumber } = request;
    const payload = {
      ktp: detail.ktp,
      contactId: detail.id,
      amount,
      bankId: formData.destBankId ?? destBankId,
      bankAccNumber: formData.destBankAccountNumber ?? destBankAccountNumber
    };

    createSavingWithdraw(payload)
      .then(() => {
        hide();
        form.clear();

        handleSuccess();
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        setDisableButtonSubmit(false);
      });
    e.event.stopPropagation();
  };

  const onFieldDataChanged = (evt: any) => {
    const { dataField, value } = evt;

    setRequest((prevState) => ({
      ...prevState,
      [dataField]: value
    }));
  };

  function onHiding() {
    setToastConfig({
      ...toastConfig,
      isVisible: false
    });
  }

  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    const socket = new SockJS(`${process.env.REACT_APP_BACKEND}api/bankAccountLive`);

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
        stompClient.subscribe(`/api/resultAccountBankByContact`, (response) => {
          console.log("Received message:", response.body);
          const res = JSON.parse(response.body);
          if (res.contactId === detail.id) {
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
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [detail.id, waitingToReconnect]);

  const sendBankCheck = () => {
    const payload = {
      contactId: detail.id,
      bankId: request.destBankId,
      bankAccountNumber: request.destBankAccountNumber
    };

    checkBankAccountByContact(payload).then((res) => {
      setDisableBankIdBankAccNumber(res.isWaiting);
    });
  };

  const handleCheckBankAccount = (e: any) => {
    if (typeof formData.destBankId === "undefined") {
      notifyWarning("belum memilih bank!!");
      e.event.preventDefault();
      return;
    }
    if (typeof request.destBankAccountNumber === "undefined") {
      notifyWarning("belum mengisi nomor rekening!!");
      e.event.preventDefault();
      return;
    }
    if (formData.destBankId == null || request.destBankAccountNumber == null) {
      notifyWarning("pastikan sudah memilih bank dan mengisi nomor rekening!!");
      e.event.preventDefault();
      return;
    }

    sendBankCheck();
  };

  const handleTarikSemua = () => {
    setRequest((prev) => ({
      ...prev,
      amount: formData.balanceSaving
    }));

    setFormData((prev) => ({
      ...prev,
      amount: formData.balanceSaving
    }));
  };

  return (
    <>
      <Toast
        visible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHiding={onHiding}
        displayTime={600}
      />
      <Popup
        maxWidth={600}
        height={"auto"}
        visible={popupVisible}
        onHiding={hide}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title="Penarikan Simpanan"
      >
        <form action="#">
          <Form
            ref={formRef}
            colCount={1}
            id="form"
            showColonAfterLabel={true}
            showValidationSummary={false}
            validationGroup="rejectApp"
            onFieldDataChanged={onFieldDataChanged}
            formData={formData}
          >
            <GroupItem>
              <GroupItem colCount={1} cssClass="dx-card responsive-paddings next-card">
                <SimpleItem
                  dataField="balanceSaving"
                  label={{ text: "Jumlah tersedia" }}
                  editorOptions={{
                    format: "Rp #,##0.00",
                    readOnly: true
                  }}
                  editorType="dxNumberBox"
                />
              </GroupItem>

              <GroupItem colCount={5} cssClass="dx-card responsive-paddings next-card m0">
                <SimpleItem
                  colSpan={3}
                  dataField="amount"
                  label={{ text: "Jumlah penarikan" }}
                  editorOptions={{
                    format: "Rp #,##0.00",
                    max: formData.balanceSaving
                  }}
                  editorType="dxNumberBox"
                />
                <ButtonItem colSpan={2} horizontalAlignment={"center"} verticalAlignment={"center"}>
                  <ButtonOptions type="default" width={"100%"} onClick={handleTarikSemua}>
                    <span className="dx-button-text">Tarik Semua</span>
                  </ButtonOptions>
                </ButtonItem>
              </GroupItem>

              <GroupItem
                caption={"Tujuan Penarikan"}
                colCount={1}
                cssClass="dx-card responsive-paddings next-card"
              >
                <SimpleItem
                  dataField="destBankId"
                  editorType="dxSelectBox"
                  editorOptions={{
                    ...listBank,
                    disabled: isDableBankIdBankAccNumber,
                    readOnly: isReadonlyBank
                  }}
                  label={{ text: "Bank" }}
                />
                <GroupItem colCount={5} cssClass="m0">
                  <SimpleItem
                    colSpan={3}
                    dataField="destBankAccountNumber"
                    label={{ text: "Nomor Rekening" }}
                    editorOptions={{
                      readOnly: isReadonlyBank,
                      disabled: isDableBankIdBankAccNumber,
                      onKeyDown: (e: any) => allowOnlyNumbers(e.event)
                    }}
                  />
                  <ButtonItem
                    colSpan={2}
                    horizontalAlignment={"center"}
                    verticalAlignment={"center"}
                    visible={!isReadonlyBank}
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
                        <span className="dx-button-text">Verifikasi</span>
                      </div>
                    </ButtonOptions>
                  </ButtonItem>
                </GroupItem>
              </GroupItem>
            </GroupItem>

            <GroupItem colCount={1} cssClass="dx-card responsive-paddings next-card">
              <SimpleItem
                dataField="description"
                editorType="dxTextArea"
                label={{ text: "Keterangan" }}
                editorOptions={{ height: 120 }}
              />
            </GroupItem>
            <ButtonItem
              horizontalAlignment="left"
              buttonOptions={{
                width: "100%",
                text: "Simpan",
                type: "default",
                disabled: isDisableButtonSubmit,
                onClick: onFormSubmit
              }}
            />
          </Form>
        </form>
      </Popup>
    </>
  );
};
