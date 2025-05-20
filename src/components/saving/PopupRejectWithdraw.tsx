import Form, { ButtonItem, SimpleItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import { Toast } from "devextreme-react/toast";
import DataSource from "devextreme/data/data_source";
import { FC, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectBoxOptions } from "src/api/contact";
import { rejectReasonWithdrawStore, rejectSavingWithdraw } from "src/api/saving";
import { notifyError, notifySuccess } from "src/utils/devExtremeUtils";

type TRequest = {
  rejectReason: string;
  description: string;
};

export const PopupRejectWithdraw: FC<any> = (props) => {
  const navigate = useNavigate();
  const formRef = useRef<Form>(null);
  const [request, setRequest] = useState<TRequest>({
    rejectReason: "",
    description: ""
  });
  const { popupVisible, hide, withdrawId } = props;
  const [toastConfig, setToastConfig] = useState<any>({
    isVisible: false,
    type: "info",
    message: ""
  });

  const rejectReasonOptions = selectBoxOptions(
    new DataSource(rejectReasonWithdrawStore),
    "Select product saving term"
  );

  const onFormSubmit = (e: any) => {
    const form = formRef.current!.instance;
    const payload = {
      ...request,
      withdrawId
    };
    rejectSavingWithdraw(payload)
      .then(() => {
        hide();
        form.clear();
        notifySuccess("Penarikan simpanan berhasil ditolak");
        navigate(`/saving/withdraw`);
      })
      .catch((err) => {
        notifyError(err);
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
        width={360}
        height={"auto"}
        visible={popupVisible}
        onHiding={hide}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title="Tolak Penarikan"
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
          >
            <SimpleItem
              dataField="rejectReason"
              editorType="dxSelectBox"
              label={{ text: "Alasan Penolakan" }}
              editorOptions={rejectReasonOptions}
            />

            <SimpleItem
              dataField="description"
              editorType="dxTextArea"
              label={{ text: "Deskripsi" }}
              editorOptions={{ height: 120 }}
            />
            <ButtonItem
              horizontalAlignment="left"
              buttonOptions={{
                width: "100%",
                text: "Submit",
                type: "danger",
                onClick: onFormSubmit
              }}
            />
          </Form>
        </form>
      </Popup>
    </>
  );
};
