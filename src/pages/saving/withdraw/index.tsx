import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { listSavingWithdrawStore } from "src/api/saving";
import { OnClickLink } from "src/components/alink";
import { ApplicationStatus } from "src/components/application-status";
import { filterOperation } from "src/constants/FilterOperation";

export default function SavingWithdraw() {
  const navigate = useNavigate();
  const dataGrid = useRef<DataGrid>(null);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Penarikan Simpanan</h2>
      <div className={"content-block"}>
        <div className={"dx-card"}>
          <DataGrid
            ref={dataGrid}
            dataSource={listSavingWithdrawStore}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={false}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
          >
            <Scrolling showScrollbar={"always"} />
            <FilterRow visible={true} />
            <Column
              alignment={"center"}
              dataField={"seqId"}
              caption={"#ID"}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                  <OnClickLink
                    onClick={() => navigate(`/saving/withdraw/detail?id=${options.data.id}`)}
                  >
                    {options.data.seqId}
                  </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
            />
            <Column
              dataField={"amount"}
              caption={"Jumlah"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              dataField={"statusName"}
              caption={"Status"}
              filterOperations={filterOperation.string}
              cellRender={ApplicationStatus}
            />
            <Column
              alignment={"center"}
              dataField={"contactSeqId"}
              caption={"#No.Kontak"}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                  <OnClickLink
                    onClick={() => navigate(`/contact/detail?id=${options.data.contactId}`)}
                  >
                    {options.data.contactSeqId}
                  </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
            />
            <Column
              dataField={"contactName"}
              caption={"Nama Anggota"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"contactIdNumber"}
              caption={"No. KTP"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"contactPhone"}
              caption={"No. HP"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"bankAccName"}
              caption={"Bank"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"bankAccNumber"}
              caption={"Nomor Rekening"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"createdByName"}
              caption={"Dibuat oleh"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"modifiedByName"}
              caption={"Dirubah oleh"}
              filterOperations={filterOperation.string}
            />

            <Paging defaultPageSize={50} />
            <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
