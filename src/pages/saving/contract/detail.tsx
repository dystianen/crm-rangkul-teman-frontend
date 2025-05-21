import { DropDownButton, LoadIndicator, RadioGroup } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import "devextreme/data/odata/store";
import queryString from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getDetailSavingContract,
  getSavingContractActivity,
  postSavingContractPartialUpdate,
  postWithdrawDeposit
} from "src/api/saving";
import { TReqPartialUpdateSavingContract, TResSavingContractDetail } from "src/api/types/ISaving";
import { OnClickLink } from "src/components/alink";
import PopupConfirm from "src/components/popup/popup-confirm";
import TableCashflow from "src/components/saving/TableCashflow";
import { initSavingContractDetail } from "src/interfaces/ISaving";
import { notifyError, notifySuccess } from "src/utils/devExtremeUtils";

const SavingContractDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);
  const [formData, setFormData] = useState<TResSavingContractDetail>(initSavingContractDetail);
  const [activity, setActivity] = useState<Array<any>>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);

  const handleGetDetail = () => {
    getDetailSavingContract(ID).then((res) => {
      setFormData(res);
    });
  };

  useEffect(() => {
    handleGetDetail();

    getSavingContractActivity(ID).then((res) => {
      setActivity(res);
    });
  }, [ID]);

  const handleDisbursement = () => {
    setLoading(true);
    postWithdrawDeposit(ID)
      .then((res) => {
        setVisible(false);
        navigate(`/withdraw/detail/${res.id}`);
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

  const handleRadioChange = (field: keyof TReqPartialUpdateSavingContract, value: boolean) => {
    setFormData((prev) => {
      if (field === "isWithdrawOnDue" && value === true) {
        return {
          ...prev,
          isWithdrawOnDue: true,
          isRenewOnDue: false
        };
      }

      if (field === "isRenewOnDue" && value === true) {
        return {
          ...prev,
          isWithdrawOnDue: false,
          isRenewOnDue: true
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  };

  const RadioGroupCell = React.memo(
    ({
      dataField,
      value,
      onChange
    }: {
      dataField: keyof TReqPartialUpdateSavingContract;
      value: boolean | null;
      onChange: (field: keyof TReqPartialUpdateSavingContract, value: boolean) => void;
    }) => (
      <RadioGroup
        items={[
          { label: "Ya", value: true },
          { label: "Tidak", value: false }
        ]}
        value={value}
        layout="horizontal"
        displayExpr="label"
        valueExpr="value"
        onValueChanged={(e) => onChange(dataField, e.value)}
        readOnly={!formData.statusIsActive}
      />
    )
  );

  const handleSubmit = () => {
    setLoadingSubmit(true);
    const payload = {
      isRenewOnDue: formData.isRenewOnDue,
      isWithdrawOnDue: formData.isWithdrawOnDue
    };

    postSavingContractPartialUpdate(ID, payload)
      .then(() => {
        notifySuccess("Berhasil memperbarui data");
        handleGetDetail();
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        setLoadingSubmit(false);
      });
  };

  return (
    <>
      <div className="title-detail">
        <h2 className={"content-block"}>Detail Perjanjian Simpanan</h2>
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
            if (e.itemData === "Pencairan sebelum jatuh tempo") {
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
                navigate("/saving/contract");
              }
            }}
          />
        </Title.Toolbar>

        <div className={"form__tabs"}>
          <Form colCount={1} id="form" formData={formData}>
            <GroupItem caption={"Detail Anggota"} cssClass="dx-card responsive-paddings">
              <GroupItem colCount={2}>
                <SimpleItem
                  dataField="contactName"
                  label={{ text: "Nama Anggota" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="contactPhoneNumber"
                  label={{ text: "Nomor HP" }}
                  editorOptions={{
                    readOnly: true,
                    mask: "+00 (X00) 000-0000",
                    maskRules: { X: /[02-9]/ }
                  }}
                />
                <SimpleItem
                  dataField="contactIdCardNumber"
                  editorType="dxTextBox"
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
                  dataField="startOn"
                  editorType="dxDateBox"
                  label={{ text: "Tanggal Mulai" }}
                  editorOptions={{
                    displayFormat: "dd MMM yyyy",
                    type: "datetime",
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="finishOn"
                  editorType="dxDateBox"
                  label={{ text: "Tanggal Selesai" }}
                  editorOptions={{
                    displayFormat: "dd MMM yyyy",
                    type: "datetime",
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
                  dataField="accrualInterest"
                  label={{ text: "Jumlah Bunga" }}
                  editorOptions={{
                    format: "Rp #,##0.00",
                    readOnly: true
                  }}
                  editorType="dxNumberBox"
                />
                <SimpleItem
                  label={{ text: "#Nomor Pengajuan" }}
                  editorType="dxTextBox"
                  dataField="appSeqId"
                  render={(data: any) => {
                    return (
                      <div style={{ marginTop: "8px" }}>
                        <OnClickLink
                          onClick={() => navigate(`/saving/application/form?id=${formData.appId}`)}
                        >
                          {data.editorOptions.value || "-"}
                        </OnClickLink>
                      </div>
                    );
                  }}
                />
              </GroupItem>
            </GroupItem>

            <GroupItem
              caption={"Kontrak Preferensi"}
              cssClass="dx-card responsive-paddings next-card"
            >
              <GroupItem colCount={1}>
                <SimpleItem
                  dataField="isRenewOnDue"
                  editorType="dxSelectBox"
                  label={{ text: "Perbarui saat jatuh tempo" }}
                  render={() => (
                    <RadioGroupCell
                      dataField="isRenewOnDue"
                      value={formData.isRenewOnDue}
                      onChange={handleRadioChange}
                    />
                  )}
                />
                <SimpleItem
                  dataField="isWithdrawOnDue"
                  editorType="dxSelectBox"
                  label={{ text: "Penarikan saat jatuh tempo" }}
                  render={() => (
                    <RadioGroupCell
                      dataField="isWithdrawOnDue"
                      value={formData.isWithdrawOnDue}
                      onChange={handleRadioChange}
                    />
                  )}
                />
              </GroupItem>
              <GroupItem visible={formData.statusIsActive}>
                <ButtonItem horizontalAlignment="left">
                  <ButtonOptions
                    type="default"
                    width={"auto"}
                    disabled={isLoadingSubmit}
                    onClick={handleSubmit}
                  >
                    <div className="button-options">
                      <LoadIndicator width="20px" height="20px" visible={isLoadingSubmit} />
                      <span className="dx-button-text">Simpan</span>
                    </div>
                  </ButtonOptions>
                </ButtonItem>
              </GroupItem>
            </GroupItem>
          </Form>
        </div>

        <TableCashflow />

        <PopupConfirm
          visible={visible}
          handleCancel={handleCancel}
          handleConfirm={handleDisbursement}
          loading={loading}
          message="Simpanan berjangka masih belum jatuh tempo. Lanjutkan ke penarikan dana? Nasabah tidak akan mendapatkan jasa atau bunga."
        />
      </div>
    </>
  );
};

export default SavingContractDetail;
