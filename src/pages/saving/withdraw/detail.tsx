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
import { TResSavingContractDetail } from "src/api/types/ISaving";
import PopupConfirm from "src/components/popup/popup-confirm";
import { initSavingContractDetail } from "src/interfaces/ISaving";
import { notifyError, notifySuccess } from "src/utils/devExtremeUtils";

const SavingWithdrawDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);
  const [formData, setFormData] = useState<TResSavingContractDetail>(initSavingContractDetail);
  const [activity, setActivity] = useState<Array<any>>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFetchDetail = () => {
    getDetailSavingWithdraw(ID).then((res) => {
      setFormData(res);
    });

    getSavingWithdrawActivity(ID).then((res) => {
      setActivity(res);
    });
  };

  useEffect(() => {
    handleFetchDetail();
  }, [ID]);

  const handleWithdraw = () => {
    setLoading(true);
    approveSavingWithdraw(ID)
      .then(() => {
        setVisible(false);
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

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <>
      <div className="title-detail">
        <h2 className={"content-block"}>Detail Penarikan Simpanan</h2>
        <DropDownButton
          visible={activity.length > 0}
          useSelectMode={false}
          stylingMode="contained"
          text="Activity"
          dropDownOptions={{
            width: 230
          }}
          items={activity}
          onItemClick={(e) => {
            if (e.itemData === "Approve") {
              setVisible(true);
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
                navigate(-1);
              }
            }}
          />
        </Title.Toolbar>

        <div className={"form__tabs"}>
          <Form colCount={1} id="form" formData={formData}>
            <GroupItem
              caption={"Informasi Penarikan"}
              cssClass="dx-card responsive-paddings next-card"
            >
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
                  label={{ text: "Jumlah Simpanan Pokok" }}
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
              caption={"Informasi Kontak"}
              cssClass="dx-card responsive-paddings next-card"
            >
              <GroupItem colCount={2}>
                <SimpleItem
                  label={{ text: "#No" }}
                  editorType="dxTextBox"
                  dataField="contactSeqId"
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
                  label={{ text: "No. HP" }}
                  editorOptions={{
                    readOnly: true,
                    mask: "+00 (X00) 000-0000",
                    maskRules: { X: /[02-9]/ }
                  }}
                />
                <SimpleItem
                  dataField="contactEmail"
                  editorType="dxTextBox"
                  label={{ text: "Email" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="contactIdNumber"
                  label={{ text: "No. KTP" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
              </GroupItem>
            </GroupItem>

            <GroupItem caption={"Informasi Bank"} cssClass="dx-card responsive-paddings next-card">
              <GroupItem colCount={2}>
                <SimpleItem
                  dataField="bankAccName"
                  label={{ text: "Bank" }}
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
          visible={visible}
          handleCancel={handleCancel}
          handleConfirm={handleWithdraw}
          loading={loading}
          message="Apakah anda yakin ingin menyetujui penarikan simpanan ini?"
        />
      </div>
    </>
  );
};

export default SavingWithdrawDetail;
