import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import "devextreme/data/odata/store";
import { useState } from "react";
import TableCashflow from "src/components/saving/TableCashflow";

const SavingCustomerDetail = () => {
  const [formData, setFormData] = useState();

  return (
    <div className={"content-block"}>
      <div className={"form__tabs dx-card responsive-paddings"}>
        <Form colCount={1} id="form" formData={formData} labelLocation="left">
          <GroupItem caption={"Detail Simpanan Anggota"}>
            <GroupItem colCount={1}>
              <SimpleItem
                dataField="id"
                label={{ text: "Nomor Anggota" }}
                editorType="dxTextBox"
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="idNumber"
                editorType="dxTextBox"
                label={{ text: "Nomor KTP" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="mobileNumber"
                editorType="dxTextBox"
                label={{ text: "Nomor HP" }}
                editorOptions={{
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
                dataField="amount"
                label={{ text: "Saldo Deposito" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="amount"
                label={{ text: "Total Saldo" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
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
