import { DropDownButton } from "devextreme-react";
import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import "devextreme/data/odata/store";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailSavingCustomer, getSavingCustomerActivity } from "src/api/saving";
import { TResSavingCustomerDetail } from "src/api/types/ISaving";
import { PopupWithdraw } from "src/components/saving/PopupWithdraw";
import TableCashflow from "src/components/saving/TableCashflow";
import { defaultSavingCustomerDetail } from "src/interfaces/ISaving";
import { notifySuccess } from "src/utils/devExtremeUtils";

const SavingCustomerDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);
  const [formData, setFormData] = useState<TResSavingCustomerDetail>(defaultSavingCustomerDetail);
  const [activity, setActivity] = useState<Array<any>>([]);
  const [visiblePopupWithdraw, setVisiblePopupWithdraw] = useState(false);

  const handleFetchDetail = useCallback(() => {
    getDetailSavingCustomer(ID).then((res) => {
      setFormData(res);
    });

    getSavingCustomerActivity(ID).then((res) => {
      setActivity(res);
    });
  }, [ID]);

  useEffect(() => {
    handleFetchDetail();
  }, [ID, handleFetchDetail]);

  const handleSuccessWithdraw = () => {
    notifySuccess("Penarikan simpanan berhasil");
    handleFetchDetail();
  };

  return (
    <>
      <div className="title-detail">
        <h2 className={"content-block"}>Detail Simpanan Anggota</h2>

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
            if (e.itemData === "Penarikan Simpanan") {
              setVisiblePopupWithdraw(true);
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
              caption={"Detail Anggota"}
              colCount={2}
              cssClass="dx-card responsive-paddings"
            >
              <SimpleItem
                dataField="name"
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
                dataField="ktp"
                editorType="dxTextBox"
                label={{ text: "Nomor KTP" }}
                editorOptions={{
                  readOnly: true
                }}
              />
            </GroupItem>

            <GroupItem
              caption={"Detail Simpanan"}
              colCount={2}
              cssClass="dx-card responsive-paddings next-card"
            >
              <SimpleItem
                dataField="lastTransactionOn"
                editorType="dxDateBox"
                label={{ text: "Terakhir Transaksi" }}
                editorOptions={{
                  displayFormat: "dd MMM yyyy",
                  type: "datetime",
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="balanceSaving"
                label={{ text: "Saldo Simpanan" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="balanceDeposit"
                label={{ text: "Saldo Deposito" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="balanceTotal"
                label={{ text: "Total Saldo" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
            </GroupItem>

            <GroupItem
              caption={"Bank Pencairan"}
              colCount={2}
              cssClass="dx-card responsive-paddings next-card"
            >
              <SimpleItem
                dataField="vaName"
                label={{ text: "Virtual Account" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="destBankAccountName"
                label={{ text: "Rekening Pencairan" }}
                editorOptions={{
                  readOnly: true
                }}
              />
            </GroupItem>
          </Form>
        </div>

        <div className="dx-card form__tabs responsive-paddings">
          <TableCashflow />
        </div>
      </div>

      <PopupWithdraw
        popupVisible={visiblePopupWithdraw}
        detail={formData}
        handleSuccess={handleSuccessWithdraw}
        hide={() => setVisiblePopupWithdraw(false)}
      />
    </>
  );
};

export default SavingCustomerDetail;
