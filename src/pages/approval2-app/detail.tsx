import "devextreme-react/date-box";
import { DropDownButton } from "devextreme-react/drop-down-button";
import "devextreme-react/file-uploader";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { getDetail, rejectApp2 } from "src/api/approval2";
import { RejectPopup } from "src/components/reject-popup";
import { AppLoanDetailRequest, initAppLoanDetailValue } from "src/interfaces/appLoanOnboarding";
import { alertWarning } from "../../utils/devExtremeUtils";
import { AppForm } from "../loan-app/AppForm";
import "./approval2-app.scss";
import { ApprovePopup } from "./ApprovePopup";
import { TRequestRejection } from "src/api/types/ILoanApp";

export default function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = queryString.parse(location.search);
  const appId = id as string;
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [popupApproveVisible, setPopupApproveVisible] = React.useState(false);
  const [detail, setDetail] = useState<AppLoanDetailRequest>(initAppLoanDetailValue);
  const [activity] = useState<Array<any>>(["Approve", "Reject"]);

  useEffect(() => {
    getDetail(appId)
      .then((res) => {
        setDetail(res);
      })
      .catch(() => {
        alertWarning("Active approval is not found!").then(() => navigate("/approval2"));
      });
  }, [appId, navigate]);

  const handleSubmitRejection = async (payload: TRequestRejection) => {
    return rejectApp2(payload).then(() => {
      navigate(`/approval2`);
    });
  };

  return (
    <>
      <div className="title-detail">
        <h2 className={"content-block"}>Detail Approval 2</h2>
        <div>
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
            }}
            width={230}
          />
        </div>
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
    </>
  );
}
