import { LoadIndicator, Popup } from "devextreme-react";
import Form, {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  Item,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import React, { Ref, useCallback, useEffect, useMemo, useState } from "react";
import { fileTypeStore, getFile } from "src/api/apploan";
import convertFileToBase64 from "src/utils/convertFileToBase64.util";
import convertUrlToBase64 from "src/utils/convertUrlToBase64.util";
import { notifyError } from "src/utils/devExtremeUtils";
import resizeImage from "src/utils/resizeImage.util";
import { selectBoxOptions } from "../../api/contact";
import { ajaxPatch, ajaxPost } from "../../api/http.api";

export interface IContactActivity {
  contactId?: string;
  id?: string;
  typeId?: string;
  file?: any;
  name?: string;
  createdAt?: string;
  urlPath?: string;
}

interface ActivityContactProps {
  appId: string;
  children?: React.ReactChild | React.ReactChild[];
  className?: string;
  documentData: IContactActivity;
  isModalVisible: boolean;
  onCloseModal: (e: any) => void;
  onSubmit: (e: any) => void;
  formActivityRef?: Ref<any>;
  contactId: string;
}

export default function DocumentForm(props: ActivityContactProps) {
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState<IContactActivity>({
    contactId: "",
    id: "",
    typeId: "",
    file: "",
    name: "",
    createdAt: ""
  });
  const [file, setFile] = useState("");

  useEffect(() => {
    setDocumentData((prev) => ({ ...prev, ...props.documentData }));

    const fetchFile = async () => {
      if (!props.documentData?.urlPath) return;

      try {
        const response = await getFile(props.documentData.urlPath, { responseType: "blob" });
        const fileUrl = URL.createObjectURL(response);

        const base64 = await convertUrlToBase64(fileUrl, response.type);
        setFile(base64);

        const fileName = props.documentData.name || "file";
        const file = new File([response], fileName, { type: response.type });
        setDocumentData((prev) => ({ ...prev, file: [file] }));

        // Cleanup object URL untuk menghindari memory leak
        URL.revokeObjectURL(fileUrl);
      } catch (error) {
        notifyError(error as string);
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [props.documentData, props.isModalVisible]);

  const fileTypeOptions = useMemo(
    () => selectBoxOptions(new DataSource(fileTypeStore), "Select File Type"),
    []
  );

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (documentData.id) {
        const payload = {
          id: documentData.id,
          typeId: documentData.typeId,
          fileName: documentData.name,
          file: file || documentData.file
        };
        await ajaxPatch(`/api/app/file/${props.appId}`, payload);
      } else {
        const payload = {
          typeId: documentData.typeId,
          fileName: documentData.name,
          file
        };
        await ajaxPost(`/api/app/file/${props.appId}`, payload);
      }

      setDocumentData({
        contactId: "",
        id: "",
        typeId: "",
        file: "",
        name: ""
      });
      setFile("");
      props.onSubmit(event);
    } catch (error) {
      setLoading(false);
      notifyError(error as string);
      console.error("Error saving document:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFieldAppDataChanged = useCallback((evt: any) => {
    setDocumentData((prev) => {
      // @ts-expect-error
      if (prev[evt.dataField] !== evt.value) {
        return { ...prev, [evt.dataField]: evt.value };
      }
      return prev;
    });
  }, []);

  const onFileChanged = useCallback(
    async (e: { value: File[] }) => {
      if (e.value?.[0] && e.value[0].name !== documentData.name) {
        try {
          let uri: string;

          if (e.value[0].type === "application/pdf") {
            const res = await convertFileToBase64(e.value[0]);
            uri = res.base64;
          } else {
            uri = await resizeImage(e.value[0]);
          }

          setFile(uri);
          setDocumentData((prev) => ({
            ...prev,
            name: e.value[0].name
          }));
        } catch (error) {
          console.error("Error processing file:", error);
        }
      }
    },
    [documentData.name]
  );

  const uploadPhotoSelfieOptions = {
    selectButtonText: "Select file",
    accept: "image/png, image/jpg, image/jpeg, application/pdf",
    uploadMode: "useForm",
    onValueChanged: onFileChanged,
    icon: "file"
  };

  return (
    <Popup width={"40%"} height={"auto"} visible={props.isModalVisible} title="Document Form">
      <form onSubmit={onSubmit}>
        <Form
          ref={props.formActivityRef}
          id="form"
          showColonAfterLabel={true}
          showValidationSummary={true}
          validationGroup="OnActivityContactData"
          formData={documentData}
          disabled={loading}
          onFieldDataChanged={onFieldAppDataChanged}
        >
          <SimpleItem
            dataField="typeId"
            editorType="dxSelectBox"
            label={{ text: "File Type" }}
            editorOptions={fileTypeOptions}
          >
            <RequiredRule message="File type is required" />
          </SimpleItem>
          <SimpleItem
            dataField="file"
            editorType={"dxFileUploader" as any}
            editorOptions={uploadPhotoSelfieOptions}
            label={{ text: "File" }}
          >
            {!documentData.id && <RequiredRule message="File is required" />}
          </SimpleItem>
          {documentData.name && (
            <Item>
              <div
                className="dx-field-value"
                style={{ width: "100%", marginTop: -40, paddingLeft: 10 }}
              >
                <div className="dx-fileuploader-file">
                  <div className="dx-fileuploader-file-info">
                    <div
                      className="dx-fileuploader-file-name"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <i className="dx-icon dx-icon-file" style={{ fontSize: 20 }}></i>
                      <span style={{ fontSize: 14, whiteSpace: "normal" }}>
                        {documentData.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Item>
          )}

          <GroupItem
            cssClass="dx-toolbar dx-widget dx-visibility-change-handler dx-collection dx-popup-bottom"
            colCount={2}
          >
            <ButtonItem horizontalAlignment="left">
              <ButtonOptions width={"100%"} onClick={props.onCloseModal}>
                <span className="dx-button-text">Close</span>
              </ButtonOptions>
            </ButtonItem>

            <ButtonItem horizontalAlignment="left">
              <ButtonOptions
                type="default"
                width={"100%"}
                disabled={loading}
                useSubmitBehavior={true}
              >
                <div className="button-options">
                  <LoadIndicator width="20px" height="20px" visible={loading} />
                  <span className="dx-button-text">Save</span>
                </div>
              </ButtonOptions>
            </ButtonItem>
          </GroupItem>
        </Form>
      </form>
    </Popup>
  );
}
