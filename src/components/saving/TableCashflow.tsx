import { DataGrid } from "devextreme-react";
import { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import { useRef } from "react";
import { filterOperation } from "src/constants/FilterOperation";
import { calculateFilterExpressionCustom } from "src/utils/devExtremeUtils";

const TableCashflow = () => {
  const dataGrid = useRef<DataGrid>(null);

  return (
    <div className={"form__tabs dx-card responsive-paddings"}>
      <h5 style={{ marginTop: 0, marginBottom: "10px" }}>Cashflow</h5>
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
        <Column dataField={"seqId"} caption={"ID"} filterOperations={filterOperation.string} />
        <Column
          dataField={"modifiedOn"}
          caption={"Tanggal"}
          dataType={"date"}
          format={"dd MMM yyyy HH:mm:ss"}
          calculateFilterExpression={calculateFilterExpressionCustom}
          filterOperations={filterOperation.date}
        />
        <Column dataField={"name"} caption={"Tipe"} filterOperations={filterOperation.string} />
        <Column
          dataField={"category"}
          caption={"Kategori"}
          filterOperations={filterOperation.string}
        />
        <Column
          dataField={"amount"}
          caption={"Jumlah"}
          filterOperations={filterOperation.numeric}
          format="Rp #,##0.00"
        />
        <Paging defaultPageSize={50} />
        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
      </DataGrid>
    </div>
  );
};

export default TableCashflow;
