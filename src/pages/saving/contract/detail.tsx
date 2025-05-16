import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import "devextreme/data/odata/store";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailSavingContract } from "src/api/saving";
import { TResSavingContractDetail } from "src/api/types/ISaving";
import { OnClickLink } from "src/components/alink";
import TableCashflow from "src/components/saving/TableCashflow";
import { initSavingContractDetail } from "src/interfaces/ISaving";

const SavingContractDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);
  const [formData, setFormData] = useState<TResSavingContractDetail>(initSavingContractDetail);

  useEffect(() => {
    getDetailSavingContract(ID).then((res) => {
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
          <GroupItem caption={"Detail Perjanjian Simpanan"}>
            <GroupItem colCount={1}>
              <SimpleItem
                dataField="seqId"
                label={{ text: "ID" }}
                editorOptions={{
                  readOnly: true
                }}
              />

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
                dataField="contactName"
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
                dataField="accrualInterest"
                label={{ text: "Jumlah Bunga" }}
                editorOptions={{
                  format: "Rp #,##0.00",
                  readOnly: true
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                label={{ text: "Nomor Pengajuan" }}
                editorType="dxTextBox"
                dataField="appSeqId"
                render={(data: any) => {
                  console.log(data);
                  return (
                    <OnClickLink
                      onClick={() => navigate(`/saving/application/form?id=${formData.appId}`)}
                    >
                      {data.editorOptions.value || "-"}
                    </OnClickLink>
                  );
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
