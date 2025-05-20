import { DataGrid } from "devextreme-react";
import { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import queryString from "query-string";
import { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { listSavingContractCashflowStore } from "src/api/saving";
import { filterOperation } from "src/constants/FilterOperation";
import { calculateFilterExpressionCustom } from "src/utils/devExtremeUtils";
import { ApplicationStatus } from "../application-status";

const TableCashflow = () => {
  const dataGrid = useRef<DataGrid>(null);
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);

  const dataSource = useMemo(() => listSavingContractCashflowStore(ID), [ID]);

  return (
    <div className={"form__tabs dx-card responsive-paddings"}>
      <h5 style={{ marginTop: 0, marginBottom: "10px" }}>Cashflow</h5>
      <DataGrid
        ref={dataGrid}
        dataSource={dataSource}
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
          sortOrder="asc"
          caption={"ID"}
          filterOperations={filterOperation.string}
        />
        <Column
          dataField={"modifiedOn"}
          caption={"Tanggal"}
          dataType={"date"}
          format={"dd MMM yyyy HH:mm:ss"}
          calculateFilterExpression={calculateFilterExpressionCustom}
          filterOperations={filterOperation.date}
        />
        <Column
          dataField={"typeName"}
          caption={"Tipe"}
          filterOperations={filterOperation.string}
          cellRender={ApplicationStatus}
        />
        <Column
          dataField={"category"}
          caption={"Kategori"}
          filterOperations={filterOperation.string}
        />
        <Column
          dataField="amount"
          caption="Jumlah Simpanan Pokok"
          filterOperations={filterOperation.numeric}
          cellRender={({ row }) => {
            const isOutflow = row.data.typeId === "OUTFLOW";
            const amount = row.data.amount;

            const formatted = amount?.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR"
            });

            const style = { color: isOutflow ? "#d71010" : "#10d710" };

            return <span style={style}>{isOutflow ? `(${formatted})` : formatted}</span>;
          }}
        />

        <Paging defaultPageSize={50} />
        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
      </DataGrid>
    </div>
  );
};

export default TableCashflow;
