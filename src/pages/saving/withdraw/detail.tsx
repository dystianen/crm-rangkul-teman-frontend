import { DropDownButton } from "devextreme-react";
import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import "devextreme/data/odata/store";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  approveSavingWithdraw,
  getDetailSavingWithdraw,
  getSavingWithdrawActivity
} from "src/api/saving";
import { TResSavingWithdrawDetail } from "src/api/types/ISaving";
import { OnClickLink } from "src/components/alink";
import PopupConfirm from "src/components/popup/popup-confirm";
import { PopupRejectWithdraw } from "src/components/saving/PopupRejectWithdraw";
import { defaultSavingWithdrawDetail } from "src/interfaces/ISaving";
import { notifyError, notifySuccess } from "src/utils/devExtremeUtils";

const SavingWithdrawDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);
  const [formData, setFormData] = useState<TResSavingWithdrawDetail>(defaultSavingWithdrawDetail);
  const [activity, setActivity] = useState<Array<any>>([]);
  const [visiblePopupConfirm, setVisiblePopupConfirm] = useState(false);
  const [visiblePopupReject, setVisiblePopupReject] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFetchDetail = useCallback(() => {
    getDetailSavingWithdraw(ID).then((res) => {
      setFormData(res);
    });

    getSavingWithdrawActivity(ID).then((res) => {
      setActivity(res);
    });
  }, [ID]);

  useEffect(() => {
    handleFetchDetail();
  }, [ID, handleFetchDetail]);

  const handleWithdraw = () => {
    setLoading(true);
    approveSavingWithdraw(ID)
      .then(() => {
        setVisiblePopupConfirm(false);
        handleFetchDetail();
        notifySuccess("Penarikan simpanan berhasil disetujui");
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="title-detail">
        <h2 className={"content-block"}>Detail Penarikan Simpanan</h2>
        <DropDownButton
          visible={formData.statusId === "WAITING_FOR_APPROVAL"}
          useSelectMode={false}
          stylingMode="contained"
          text="Activity"
          dropDownOptions={{
            width: 230
          }}
          items={activity}
          onItemClick={(e) => {
            if (e.itemData === "Approve") {
              setVisiblePopupConfirm(true);
            } else if (e.itemData === "Reject") {
              setVisiblePopupReject(true);
            }
          }}
          width={230}
        />
      </div>
      <div className={"content-block"}>
        <Title.Toolbar className={"dx-card"}>
          <Title.Item
            location="before"
            widget="dxButton"
            options={{
              icon: "back",
              text: "Kembali",
              onClick: () => {
                navigate("/saving/withdraw");
              }
            }}
          />
        </Title.Toolbar>

        <div className={"form__tabs"}>
          <Form colCount={1} id="form" formData={formData}>
            <GroupItem caption={"Detail Anggota"} cssClass="dx-card responsive-paddings next-card">
              <GroupItem colCount={2}>
                <SimpleItem
                  label={{ text: "#ID Anggota" }}
                  editorType="dxTextBox"
                  dataField="contactSeqId"
                  render={(data: any) => {
                    return (
                      <div style={{ marginTop: "10px" }}>
                        <OnClickLink
                          onClick={() => navigate(`/contact/detail?id=${formData.contactId}`)}
                        >
                          {data.editorOptions.value || "-"}
                        </OnClickLink>
                      </div>
                    );
                  }}
                />
                <SimpleItem
                  dataField="contactName"
                  label={{ text: "Nama Anggota" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="contactPhone"
                  label={{ text: "Nomor HP" }}
                  editorOptions={{
                    readOnly: true,
                    mask: "+00 (X00) 000-0000",
                    maskRules: { X: /[02-9]/ }
                  }}
                />
                <SimpleItem
                  dataField="contactIdNumber"
                  label={{ text: "Nomor KTP" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
              </GroupItem>
            </GroupItem>

            <GroupItem caption={"Detail Simpanan"} cssClass="dx-card responsive-paddings next-card">
              <GroupItem colCount={2}>
                <SimpleItem
                  dataField="seqId"
                  editorType="dxTextBox"
                  label={{ text: "#ID" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="statusName"
                  editorType="dxTextBox"
                  label={{ text: "Status" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="amount"
                  label={{ text: "Jumlah Penarikan" }}
                  editorOptions={{
                    format: "Rp #,##0.00",
                    readOnly: true
                  }}
                  editorType="dxNumberBox"
                />
                <SimpleItem
                  dataField="description"
                  editorType="dxTextBox"
                  label={{ text: "Deskripsi" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
              </GroupItem>
            </GroupItem>

            <GroupItem
              caption={"Penarikan Simpanan"}
              cssClass="dx-card responsive-paddings next-card"
            >
              <GroupItem colCount={2}>
                <SimpleItem
                  dataField="bankAccName"
                  label={{ text: "Bank Penarikan" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="bankAccNumber"
                  label={{ text: "Nomor Rekening" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
              </GroupItem>
            </GroupItem>
          </Form>
        </div>

        <PopupConfirm
          visible={visiblePopupConfirm}
          handleCancel={() => setVisiblePopupConfirm(false)}
          handleConfirm={handleWithdraw}
          loading={loading}
          message="Apakah anda yakin ingin menyetujui penarikan simpanan ini?"
        />

        <PopupRejectWithdraw
          withdrawId={ID}
          popupVisible={visiblePopupReject}
          hide={() => setVisiblePopupReject(false)}
        />
      </div>
    </>
  );
};

export default SavingWithdrawDetail;
