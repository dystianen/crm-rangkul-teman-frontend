import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {approve, getActivity, getDetail} from "../../api/restructure_v2";
import * as Title from "devextreme-react/toolbar";
import {RestructureFormV2} from "./restructure_formv2";
import {restructure_category} from "../../constants/variableConstata";
import {DropDownButton} from "devextreme-react/drop-down-button";
import {ApproveRestructurePopup} from "./approve_pop";
import {RejectRestructurePopup} from "./reject_pop";
import {confirm} from "devextreme/ui/dialog";
import {notifyError, notifySuccess} from "../../utils/devExtremeUtils";


export const RestructureDetailPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [activity, setActivity] = useState<Array<any>>([]);

    const [popupRejectVisible, setPopupRejectVisible] = React.useState(false);
    const [popupApproveVisible, setPopupApproveVisible] = React.useState(false);

    const [restructure, setRestructure] = useState<any>({});

    useEffect(() => {
        getDetail(id).then(rs => {
            console.log("detail restructure ", rs);
            setRestructure(rs);
        });
        getActivity(id).then(rs => setActivity(rs));
    }, []);

    return (<>
            <div className="title-detail">
                <h2 className={'content-block'}>Restructure No# {restructure?.seqId}</h2>
                <div>
                    <DropDownButton
                        stylingMode="contained"
                        text="Activity"
                        dropDownOptions={{
                            width: 230,
                        }}
                        items={activity}
                        onItemClick={(e) => {
                            const text = e.itemData;
                            if (text == "Reject") {
                                setPopupRejectVisible(true);
                            }
                            if (text == "Approve") {
                              confirm("Apakah anda yakin menyetujui restructure ini?", "Konfirmasi Restruktur").then((dialogResult) => {
                                if (dialogResult) {
                                  approve({restructureId: id}).then(sr=>{
                                    notifySuccess("Submit approval berhasil!!");
                                  }).catch(()=>notifyError("Approval restructure GAGAL!!"));
                                }
                              });
                            }
                        }}
                        width={230}
                    />
                </div>
            </div>
            <div className={'content-block'}>
                <Title.Toolbar className={"dx-card"}>
                    <Title.Item
                        location="before"
                        widget="dxButton"
                        options={{
                            icon: "back",
                            text: "Kembali",
                            onClick: () => {
                                navigate(-1);
                            },
                        }}
                    />
                </Title.Toolbar>
                <div className="form__tabs">
                    {(restructure?.categoryId === restructure_category.restructure2) &&
                        <RestructureFormV2 restructure={restructure} setRestructure={setRestructure}/>}
                </div>
            </div>

            <ApproveRestructurePopup detail={setRestructure} data={restructure} popupVisible={popupApproveVisible}
                                     hide={() => setPopupApproveVisible(false)}/>
            <RejectRestructurePopup detail={setRestructure} data={restructure} popupVisible={popupRejectVisible}
                                    hide={() => setPopupRejectVisible(false)}/>
        </>
    );
}
