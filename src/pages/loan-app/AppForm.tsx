import { DataGrid } from "devextreme-react";
import { Button } from "devextreme-react/button";
import { Column, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import { FC } from "react";
import { useNavigate } from "react-router";
import { TabFooter } from "./TabFooter";

export const AppForm: FC<any> = ({ detail }) => {
  const navigate = useNavigate();
  return (
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
      <div className={"form__tabs dx-card responsive-paddings"}>
        <Form colCount={1} id="form" formData={detail} showColonAfterLabel={true}>
          <GroupItem colSpan={2}>
            <GroupItem caption={"Detil Pengajuan"} colCount={2}>
              <SimpleItem
                dataField="application.idSeq"
                label={{ text: "No. Pengajuan #" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="application.transactionDate"
                label={{ text: "Tanggal Pengajuan" }}
                editorOptions={{
                  displayFormat: "dd MMM yyyy",
                  type: "datetime",
                  readOnly: true
                }}
                editorType="dxDateBox"
              />
              <SimpleItem
                dataField="application.loanAmount"
                label={{ text: "Jumlah Pengajuan" }}
                editorOptions={{
                  readOnly: true,
                  format: "Rp #,##0.00"
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="application.loanTerm"
                label={{ text: "Lama" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="application.loanStatus"
                label={{ text: "Status" }}
                editorOptions={{
                  readOnly: true
                }}
              />
            </GroupItem>
          </GroupItem>
        </Form>
      </div>
      <div className={"dx-card responsive-paddings next-card"}>
        <div
          className="dx-form-group-with-caption mb14"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span className="dx-form-group-caption">Kontak</span>
          <Button
            icon="textdocument"
            type="success"
            onClick={() => navigate(`/contact/detail?id=${detail.client?.id}`)}
          />
        </div>
        <Form colCount={1} id="form2" formData={detail} showColonAfterLabel={true}>
          <GroupItem colSpan={2}>
            <GroupItem caption="" colCount={2}>
              <SimpleItem
                dataField="client.idSeq"
                label={{ text: "#No" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="client.name"
                label={{ text: "Nama Lengkap" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="client.phoneNumber"
                label={{ text: "No. HP" }}
                editorOptions={{
                  readOnly: true,
                  mask: "+00 (X00) 000-0000",
                  maskRules: { X: /[02-9]/ }
                }}
              />
              <SimpleItem
                dataField="client.email"
                label={{ text: "Email" }}
                editorOptions={{
                  readOnly: true
                }}
              />
            </GroupItem>
          </GroupItem>
        </Form>
      </div>
      <div className={"dx-card responsive-paddings next-card"}>
        <Form colCount={1} id="form3" formData={detail} showColonAfterLabel={true}>
          <GroupItem colSpan={2}>
            <GroupItem caption="Pencairan" colCount={2}>
              <SimpleItem
                dataField="disbursement.bank"
                label={{ text: "Bank" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="disbursement.bankAccNumber"
                label={{ text: "Bank account number" }}
                editorOptions={{
                  readOnly: true
                }}
              />
            </GroupItem>
          </GroupItem>
        </Form>
      </div>
      <div className={"dx-card responsive-paddings next-card"}>
        <Form colCount={1} id="form4" formData={detail} showColonAfterLabel={true}>
          <GroupItem colSpan={2}>
            <GroupItem caption="Informasi Tambahan" colCount={2}>
              <SimpleItem
                dataField="additionalInformation.loanPurpose"
                label={{ text: "Tujuan Pinjaman" }}
                editorOptions={{
                  readOnly: true
                }}
              />
              <SimpleItem
                dataField="additionalInformation.monthlyIncome"
                label={{ text: "Pendapatan bulanan" }}
                editorOptions={{
                  readOnly: true,
                  format: "Rp #,##0.00"
                }}
              />
            </GroupItem>
          </GroupItem>
        </Form>
      </div>
      <div className={"dx-card responsive-paddings next-card"}>
        <div className="dx-form-group-with-caption mb14">
          <span className="dx-form-group-caption">Custom Data</span>
        </div>
        <DataGrid
          dataSource={detail.customData}
          remoteOperations={true}
          columnAutoWidth={true}
          wordWrapEnabled={false}
          showBorders={true}
          dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
          repaintChangesOnly={true}
        >
          <Scrolling showScrollbar={"always"} />

          <Column dataField={"no"} caption={"No."} alignment={"center"} width={100} />
          <Column dataField={"name"} caption={"Name"} />
          <Column dataField={"value"} caption={"Value"} />
          <Paging defaultPageSize={50} />
          <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
        </DataGrid>
      </div>
      <TabFooter />
    </div>
  );
};
