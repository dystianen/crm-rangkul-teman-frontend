import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import "devextreme/data/odata/store";
import { useState } from "react";
import TableCashflow from "src/components/saving/TableCashflow";

const SavingContractDetail = () => {
  const [formData, setFormData] = useState();

  return (
    <div className={"content-block"}>
      <div className={"form__tabs dx-card responsive-paddings"}>
        <Form colCount={1} id="form" formData={formData} labelLocation="left">
          <GroupItem caption={"Detail Perjanjian Simpanan"}>
            <GroupItem colCount={1}>
              <SimpleItem
                dataField="id"
                label={{ text: "ID" }}
                editorType="dxTextBox"
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="startOn"
                editorType="dxTextBox"
                label={{ text: "Tanggal Mulai" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="finishOn"
                editorType="dxTextBox"
                label={{ text: "Tanggal Selesai" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="status"
                editorType="dxTextBox"
                label={{ text: "Status" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="name"
                editorType="dxTextBox"
                label={{ text: "Nama Anggota" }}
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
                dataField="amount"
                label={{ text: "Jumlah Bunga" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="loanId"
                editorType="dxTextBox"
                label={{ text: "Nomor Pengajuan" }}
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

export default SavingContractDetail;
