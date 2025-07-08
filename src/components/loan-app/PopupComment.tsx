import Button from "devextreme-react/button";
import Form, { SimpleItem } from "devextreme-react/form";
import LoadIndicator from "devextreme-react/load-indicator";
import { Popup } from "devextreme-react/popup";
import { Toast } from "devextreme-react/toast";
import { RequiredRule } from "devextreme-react/validator";
import { ToastType } from "devextreme/ui/toast";
import { FC, useRef, useState } from "react";

export type TRequestComment = {
  comment: string;
};

type PopupCommentProps = {
  popupVisible: boolean;
  hide: () => void;
  onFormSubmit: (payload: TRequestComment) => Promise<void>;
};

export const PopupComment: FC<PopupCommentProps> = ({ popupVisible, hide, onFormSubmit }) => {
  const formRef = useRef<Form>(null);
  const [request, setRequest] = useState<TRequestComment>({ comment: "" });
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const [toastConfig, setToastConfig] = useState<{
    isVisible: boolean;
    type: ToastType;
    message: string;
  }>({
    isVisible: false,
    type: "info",
    message: ""
  });

  const onFieldDataChanged = (evt: any) => {
    const { dataField, value } = evt;

    setRequest((prevState) => ({
      ...prevState,
      [dataField]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.event.stopPropagation();

    const form = formRef.current?.instance;
    if (form && !form.validate().isValid) return;

    setIsLoadingSubmit(true);
    try {
      await onFormSubmit(request);
      form?.clear();
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const onHiding = () => {
    setToastConfig({ ...toastConfig, isVisible: false });
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
        width={360}
        height={"auto"}
        visible={popupVisible}
        onHiding={hide}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title="Tambahkan Komentar"
      >
        <form action="#">
          <Form
            ref={formRef}
            colCount={1}
            id="form"
            showColonAfterLabel={true}
            showValidationSummary={false}
            validationGroup="commentApp"
            onFieldDataChanged={onFieldDataChanged}
          >
            <SimpleItem
              dataField="comment"
              editorType="dxTextArea"
              label={{ text: "Komentar" }}
              editorOptions={{ height: 120 }}
            >
              <RequiredRule message="Komentar wajib diisi!" />
            </SimpleItem>

            <SimpleItem>
              <Button type="default" width="100%" disabled={isLoadingSubmit} onClick={handleSubmit}>
                <div
                  className="button-options"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <LoadIndicator width="20px" height="20px" visible={isLoadingSubmit} />
                  <span className="dx-button-text">
                    {isLoadingSubmit ? "Mengirim..." : "Kirim"}
                  </span>
                </div>
              </Button>
            </SimpleItem>
          </Form>
        </form>
      </Popup>
    </>
  );
};
