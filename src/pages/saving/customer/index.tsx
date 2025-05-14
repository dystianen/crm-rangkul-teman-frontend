import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import React, { useRef } from "react";
import { filterOperation } from "src/constants/FilterOperation";

export default function SavingCustomer() {
  const dataGrid = useRef<DataGrid>(null);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Simpanan Anggota</h2>
      <div className={"content-block"}>
        <div className={"dx-card"}>
          <DataGrid
            ref={dataGrid}
            dataSource={[]}
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
              dataField={"seqId"}
              caption={"#Nomor Anggota"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"idNumber"}
              caption={"Nomor KTP"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"mobileNumber"}
              caption={"Nomor HP"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"amount"}
              caption={"Saldo Simpanan"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              dataField={"amount"}
              caption={"Saldo Deposito"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              dataField={"amount"}
              caption={"Total Saldo"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />

            <Paging defaultPageSize={50} />
            <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
