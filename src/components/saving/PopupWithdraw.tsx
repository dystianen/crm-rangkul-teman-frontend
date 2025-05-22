import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import { Toast } from "devextreme-react/toast";
import { FC, useEffect, useRef, useState } from "react";
import { createSavingWithdraw } from "src/api/saving";
import { TResSavingCustomerDetail } from "src/api/types/ISaving";
import { notifyError } from "src/utils/devExtremeUtils";

export const PopupWithdraw: FC<any> = (props) => {
  const { popupVisible, hide, detail, handleSuccess } = props;
  const formRef = useRef<Form>(null);
  const [request, setRequest] = useState<{
    amount: number;
  }>({
    amount: 0
  });

  const [toastConfig, setToastConfig] = useState<any>({
    isVisible: false,
    type: "info",
    message: ""
  });
  const [formData, setFormData] = useState<TResSavingCustomerDetail>({ ...detail });
  const [isDisableButtonSubmit, setDisableButtonSubmit] = useState<boolean>(false);

  useEffect(() => {
    setFormData({ ...detail });
  }, [detail, popupVisible]);

  const onFormSubmit = (e: any) => {
    setDisableButtonSubmit(true);
    const form = formRef.current!.instance;
    const { amount } = request;
    const payload = {
      ktp: detail.ktp,
      contactId: detail.id,
      amount,
      bankId: formData.destBankId,
      bankAccountNumber: formData.destBankAccountNumber
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
                  dataField="destBankName"
                  label={{ text: "Bank" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="destBankAccountNumber"
                  label={{ text: "Nomor Rekening" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
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
