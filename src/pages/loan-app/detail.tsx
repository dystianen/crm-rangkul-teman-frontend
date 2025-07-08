import { DropDownButton } from "devextreme-react";
import "devextreme-react/date-box";
import "devextreme-react/file-uploader";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import {
  appLoanDetailActivityApi,
  appLoanDetailApi,
  getFile,
  postVerificatorComment
} from "src/api/apploan";
import { PopupComment, TRequestComment } from "src/components/loan-app/PopupComment";
import { AppLoanDetailRequest, initAppLoanDetailValue } from "src/interfaces/appLoanOnboarding";
import { notifyError, notifySuccess } from "src/utils/devExtremeUtils";
import PopupForbiddenMessage from "../../components/warning-app-detail";
import { AppForm } from "./AppForm";
import "./loan-app.scss";

export default function DetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const appId = String(id);
  const [detail, setDetail] = useState<AppLoanDetailRequest>(initAppLoanDetailValue);
  const [activity, setActivity] = useState<Array<any>>([]);
  const [isShowPopupComment, setShowPopupComment] = useState(false);

  const downloadFile = (urlPath: string) => {
    var filename = urlPath.replace(/^.*[\\/]/, "");
    getFile(urlPath, { responseType: "blob" })
      .then(function (response) {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(response);
        link.download = filename;
        link.click();
      })
      .catch((error: any) => {
        console.error("ERROR:: ", error);
      });
  };

  const fetchAppLoanData = useCallback(() => {
    appLoanDetailApi(appId).then((res: unknown) => {
      const data = res as AppLoanDetailRequest;
      setDetail(data);
    });

    appLoanDetailActivityApi(appId).then((res) => {
      setActivity(res);
    });
  }, [appId]);

  useEffect(() => {
    fetchAppLoanData();
  }, [appId, fetchAppLoanData]);

  const hidePopupComment = () => {
    setShowPopupComment(false);
  };

  const handleFormCommentSubmit = async (payload: TRequestComment) => {
    postVerificatorComment(appId, payload)
      .then(() => {
        notifySuccess("Status berhasil diubah menjadi 'Waiting for Documents'");
        fetchAppLoanData();
        hidePopupComment();
      })
      .catch((err) => {
        notifyError(err.message);
      });
  };

  return (
    <>
      <div className="title-detail">
        <h2 className={"content-block"}>Detail Pengajuan</h2>
        <div>
          <DropDownButton
            useSelectMode={false}
            stylingMode="contained"
            text="Activity"
            dropDownOptions={{
              width: 230
            }}
            items={activity}
            onItemClick={(e) => {
              const text = e.itemData;
              if (text === "Download signed application" && detail.document.signedDocPath) {
                downloadFile(detail.document.signedDocPath);
              } else if (
                text === "Download unsigned application" &&
                detail.document.unsignedDocPath
              ) {
                downloadFile(detail.document.unsignedDocPath);
              } else if (text === "Upload signed application") {
                navigate(`/loan-app/detail/upload-signed?id=${detail.application.id}`);
              } else if (text === "Waiting for Document") {
                setShowPopupComment(true);
              }
            }}
            width={230}
          />
        </div>
      </div>
      <AppForm detail={detail} />

      <PopupComment
        popupVisible={isShowPopupComment}
        onFormSubmit={handleFormCommentSubmit}
        hide={hidePopupComment}
      />

      <PopupForbiddenMessage appId={appId} />
    </>
  );
}
