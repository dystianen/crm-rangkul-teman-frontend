import React, {useEffect, useMemo, useRef, useState} from "react";
import Form, {
  GroupItem,
  RequiredRule,
  SimpleItem,
} from "devextreme-react/form";

import "devextreme-react/file-uploader";
import "./loan-app.scss";

import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import "devextreme-react/date-box";

import * as Title from "devextreme-react/toolbar";
import { Item } from "devextreme-react/data-grid";
import { Button, LoadPanel } from "devextreme-react";
import { submitAppLoanSignedDocument } from "src/api/apploan";
import notify from "devextreme/ui/notify";
import PdfViewer from "../../components/pdf-viewer/PdfViewer";

export default function UploadSignedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const [docProof, setDocProof] = useState<any>(undefined);
  const formRef = useRef<Form>(null);
  const [submitForm, setSubmitForm] = useState(false);

  const handleSubmit = (e: any) => {
    setSubmitForm(true);
    const form = formRef.current!.instance;
    const signedDoc = docProof ? docProof.split(",")[1] : null;
    if(signedDoc){
      submitAppLoanSignedDocument(id as string, {
        signedDoc: signedDoc,
      }).then((res) => {
        setDocProof("");
        form.resetValues();
        navigate(`/loan-app`);
      },(error) => {
        setSubmitForm(false);
        notify(
            {
              message: error,
              position: {
                my: "center top",
                at: "center top",
              },
            },
            "error",
            3000
        );
      });
    }
  };

  const handleBack = () => {
    navigate(`/loan-app/detail?id=${id}`);
  };

  const onFileChanged = (e: any) => {
    if (e.value.length > 0) {
      try {
        if(e.value.length){
          var fileToLoad = e.value[0];
          var fileReader = new FileReader();
          var base64;
          fileReader.onload = function(fileLoadedEvent:any) {
            base64 = fileLoadedEvent.target.result;
            setDocProof(base64);
          };
          fileReader.readAsDataURL(fileToLoad);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const uploadKtpOptions = {
    selectButtonText: "Select document",
    accept: "application/pdf",
    uploadMode: "useForm",
    onValueChanged: onFileChanged,
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
      <div className="title-detail">
        <h2 className={"content-block"}>Upload Signed Document</h2>
      </div>
      <div className={"content-block"}>
        <Title.Toolbar className={"dx-card"}>
          <Title.Item
            location="before"
            widget="dxButton"
            options={{
              icon: "back",
              text: "Back",
              onClick: handleBack,
            }}
          />
        </Title.Toolbar>
        <div className={"dx-card responsive-paddings"}>
          <form action="register" onSubmit={() => {}}>
            <Form
              ref={formRef}
              colCount={1}
              id="form"
              showColonAfterLabel={true}
            >
              <GroupItem colSpan={1}>
                <GroupItem caption="" colCount={1}>
                  <SimpleItem
                    dataField="signedDoc"
                    editorType="dxFileUploader"
                    editorOptions={uploadKtpOptions}
                    label={{ text: "Document" }}
                  >
                    <RequiredRule message="Document is required" />
                  </SimpleItem>
                </GroupItem>
              </GroupItem>
              <GroupItem colSpan={1}>
                {docProof && (
                  <Item>
                    <PdfViewer url={docProof} />
                  </Item>
                )}
              </GroupItem>
            </Form>
          </form>
        </div>
        <div className="next-card btn-flex">
          <Button text="Cancel" type="normal" onClick={handleBack} />
          <Button
            id="next-btn"
            text="Submit"
            type="default"
            onClick={(e: any) => {
              handleSubmit(e);
            }}
          />
        </div>
      </div>
    </>
  );
}
