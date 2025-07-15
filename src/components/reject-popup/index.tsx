import Form, { ButtonItem, SimpleItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import { Toast } from "devextreme-react/toast";
import { RequiredRule } from "devextreme-react/validator";
import { FC, useRef, useState } from "react";
import { TRequestRejection } from "src/api/types/ILoanApp";
import MultiSelect from "src/components/multiselect";
import { rejectReasonStore } from "../../api/approval2";

type TRequest = {
  rejectList: string[];
  description: string;
};

type TProps = {
  appId: string;
  approvalId: string;
  popupVisible: boolean;
  hide: () => void;
  handleSubmit: (payload: TRequestRejection) => Promise<void>;
};

export const RejectPopup: FC<TProps> = (props) => {
  const { appId, approvalId, popupVisible, hide, handleSubmit } = props;

  const formRef = useRef<Form>(null);
  const [request, setRequest] = useState<TRequest>({
    rejectList: [],
    description: ""
  });
  const [toastConfig, setToastConfig] = useState<any>({
    isVisible: false,
    type: "info",
    message: ""
  });

  const onFormSubmit = (e: any) => {
    const form = formRef.current!.instance;
    const payload = {
      ...request,
      appId,
      approvalId
    };

    e.event.stopPropagation();
    handleSubmit(payload)
      .then(() => {
        hide();
        setToastConfig({
          ...toastConfig,
          isVisible: true,
          type: "success",
          message: "Successfully reject application"
        });
        form.clear();
      })
      .catch(() => {
        setToastConfig({
          ...toastConfig,
          isVisible: true,
          type: "error",
          message: "Failed reject application"
        });
      });
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
        title="Reject Application"
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
              dataField="rejectList"
              label={{ text: "Reject Reason" }}
              render={({ component, dataField }) => (
                <MultiSelect
                  value={request.rejectList}
                  dataSource={rejectReasonStore(approvalId)}
                  component={component}
                  fieldName={dataField}
                  placeholder={"Select Reason"}
                />
              )}
            />

            <SimpleItem
              dataField="description"
              editorType="dxTextArea"
              label={{ text: "Description" }}
              editorOptions={{ height: 120 }}
            >
              <RequiredRule message="description is required" />
            </SimpleItem>
            <ButtonItem
              horizontalAlignment="left"
              buttonOptions={{
                width: "100%",
                text: "Submit",
                type: "success",
                onClick: onFormSubmit
              }}
            />
          </Form>
        </form>
      </Popup>
    </>
  );
};
