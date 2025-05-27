import "devextreme-react/date-box";
import { DropDownButton } from "devextreme-react/drop-down-button";
import "devextreme-react/file-uploader";
import queryString from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { activityApproval1, backToVerify, getDetail, rejectApp1 } from "src/api/approval1";
import { TRequestRejection } from "src/api/types/ILoanApp";
import PopupConfirm from "src/components/popup/popup-confirm";
import { RejectPopup } from "src/components/reject-popup";
import { AppLoanDetailRequest, initAppLoanDetailValue } from "src/interfaces/appLoanOnboarding";
import { alertWarning, notifyError } from "../../utils/devExtremeUtils";
import { AppForm } from "../loan-app/AppForm";
import "./approval1-app.scss";
import { ApprovePopup } from "./ApprovePopup";

export default function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = queryString.parse(location.search);
  const appId = id as string;
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [popupApproveVisible, setPopupApproveVisible] = React.useState(false);
  const [detail, setDetail] = useState<AppLoanDetailRequest>(initAppLoanDetailValue);
  const [activity, setActivity] = useState<Array<any>>([]);
  const [popupBacktoVerify, setPopupBacktoVerify] = useState(false);
  const [loadingBanktoVerify, setLoadingBacktoVerify] = useState(false);

  useEffect(() => {
    getDetail(appId)
      .then((res) => {
        setDetail(res);
      })
      .catch(() => {
        alertWarning("Active approval is not found!").then(() => navigate("/approval1"));
      });

    activityApproval1(appId).then(setActivity);
  }, [appId, navigate]);

  const handleSubmitRejection = async (payload: TRequestRejection) => {
    return rejectApp1(payload).then(() => {
      navigate(`/approval1`);
    });
  };

  const handleClosePopupBacktoVerify = useCallback(() => {
    setPopupBacktoVerify(false);
  }, []);

  const handleSubmitBacktoVerify = useCallback(() => {
    setLoadingBacktoVerify(true);
    backToVerify(appId)
      .then(() => {
        handleClosePopupBacktoVerify();
        navigate("/loan-app");
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        setLoadingBacktoVerify(false);
      });
  }, [appId, handleClosePopupBacktoVerify, navigate]);

  return (
    <>
      <div className="title-detail">
        <h2 className={"content-block"}>Detail Approval 1</h2>
        <DropDownButton
          stylingMode="contained"
          text="Activity"
          dropDownOptions={{
            width: 230
          }}
          items={activity}
          onItemClick={(e) => {
            const text = e.itemData;
            if (text === "Reject") {
              setPopupVisible(true);
            }
            if (text === "Approve") {
              setPopupApproveVisible(true);
            }
            if (text === "Back to Verify") {
              setPopupBacktoVerify(true);
            }
          }}
          width={230}
        />
      </div>

      <AppForm detail={detail} />

      <RejectPopup
        appId={appId}
        approvalId={detail.approvalId || ""}
        popupVisible={popupVisible}
        hide={() => setPopupVisible(false)}
        handleSubmit={handleSubmitRejection}
      />

      <ApprovePopup
        detail={setDetail}
        data={detail}
        popupVisible={popupApproveVisible}
        hide={() => setPopupApproveVisible(false)}
      />

      <PopupConfirm
        visible={popupBacktoVerify}
        message={"Are you sure to revert application to verify status?"}
        loading={loadingBanktoVerify}
        handleCancel={handleClosePopupBacktoVerify}
        handleConfirm={handleSubmitBacktoVerify}
        cancelText="No"
        confirmText="Yes"
      />
    </>
  );
}
