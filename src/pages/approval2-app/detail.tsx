import React, { useEffect, useState } from "react";

import "devextreme-react/file-uploader";
import "./approval2-app.scss";

import queryString from "query-string";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

import "devextreme-react/date-box";
import { DropDownButton } from "devextreme-react/drop-down-button";
import { getDetail } from "src/api/approval2";
import { AppLoanDetailRequest, initAppLoanDetailValue } from "src/interfaces/appLoanOnboarding";
import { alertWarning } from "../../utils/devExtremeUtils";
import { AppForm } from "../loan-app/AppForm";
import { ApprovePopup } from "./ApprovePopup";
import { RejectPopup } from "./RejectPopup";

export default function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = queryString.parse(location.search);
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [popupApproveVisible, setPopupApproveVisible] = React.useState(false);

  const [detail, setDetail] = useState<AppLoanDetailRequest>(initAppLoanDetailValue);
  const [activity, setActivity] = useState<Array<any>>(["Approve", "Reject"]);

  useEffect(() => {
    getDetail(String(id))
      .then((res: unknown) => {
        console.log("res detail approval 2: ", res);
        const data = res as AppLoanDetailRequest;
        setDetail(data);
      })
      .catch((err: any) => {
        alertWarning("Active approval is not found!").then(() => navigate("/approval2"));
      });
  }, [id]);

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
              console.log("text ", text);
            }}
            width={230}
          />
        </div>
      </div>

      <AppForm detail={detail} />
      <RejectPopup data={detail} popupVisible={popupVisible} hide={() => setPopupVisible(false)} />
      <ApprovePopup
        detail={setDetail}
        data={detail}
        popupVisible={popupApproveVisible}
        hide={() => setPopupApproveVisible(false)}
      />
    </>
  );
}
