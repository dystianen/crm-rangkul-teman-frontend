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
      <div className={"form__tabs dx-card responsive-paddings"}>
        <Form colCount={1} id="form" formData={formData} labelLocation="left">
          <GroupItem caption={"Detail Simpanan Anggota"}>
            <GroupItem colCount={1}>
              <SimpleItem
                dataField="seqId"
                label={{ text: "Nomor Anggota" }}
                editorType="dxTextBox"
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
              <SimpleItem
                dataField="contactPhone"
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
        </Form>
      </div>

      <TableCashflow />
    </div>
  );
};

export default SavingCustomerDetail;
