import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import React, { useRef } from "react";
import { ApplicationStatus } from "src/components/application-status";
import { filterOperation } from "src/constants/FilterOperation";
import { calculateFilterExpressionCustom } from "src/utils/devExtremeUtils";

export default function SavingPayment() {
  const dataGrid = useRef<DataGrid>(null);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Pembayaran Simpanan</h2>
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
            <Column dataField={"id"} caption={"ID"} filterOperations={filterOperation.string} />
            <Column
              dataField={"modifiedOn"}
              caption={"Tanggal Pembayaran"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
            />
            <Column
              dataField={"product"}
              caption={"Nama Anggota"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"amount"}
              caption={"Jumlah Pembayaran"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              dataField={"status"}
              caption={"Status"}
              filterOperations={filterOperation.string}
              cellRender={ApplicationStatus}
            />
            <Column
              dataField={"term"}
              caption={"No. Virtual Account"}
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
