import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import "devextreme/data/odata/store";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailSavingCustomer } from "src/api/saving";
import { TResSavingCustomerDetail } from "src/api/types/ISaving";
import TableCashflow from "src/components/saving/TableCashflow";
import { defaultSavingCustomerDetail } from "src/interfaces/ISaving";

const SavingCustomerDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);
  const [formData, setFormData] = useState<TResSavingCustomerDetail>(defaultSavingCustomerDetail);

  useEffect(() => {
    getDetailSavingCustomer(ID).then((res) => {
      setFormData(res);
    });
  }, [ID]);

  return (
    <div className={"content-block"} style={{ marginTop: "16px" }}>
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
          <GroupItem caption={"Informasi Simpanan"} cssClass="dx-card responsive-paddings">
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
                dataField="amount"
                label={{ text: "Saldo Simpanan" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="depositAmountBalance"
                label={{ text: "Saldo Deposito" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="totalBalance"
                label={{ text: "Total Saldo" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
            </GroupItem>
          </GroupItem>

          <GroupItem caption={"Informasi Kontak"} cssClass="dx-card responsive-paddings next-card">
            <GroupItem colCount={2}>
              <SimpleItem label={{ text: "#No" }} editorType="dxTextBox" dataField="contactSeqId" />
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
                dataField="contactIdCardNumber"
                editorType="dxTextBox"
                label={{ text: "Nomor KTP" }}
                editorOptions={{
                  readOnly: true
                }}
              />
            </GroupItem>
          </GroupItem>
        </Form>
      </div>

      <TableCashflow />
    </div>
  );
};

export default SavingCustomerDetail;
