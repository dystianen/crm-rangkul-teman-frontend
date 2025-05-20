import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { listSavingCustomerStore } from "src/api/saving";
import { OnClickLink } from "src/components/alink";
import { filterOperation } from "src/constants/FilterOperation";
import { calculateFilterExpressionCustom } from "../../../utils/devExtremeUtils";

export default function SavingCustomer() {
  const navigate = useNavigate();
  const dataGrid = useRef<DataGrid>(null);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Simpanan Anggota</h2>
      <div className={"content-block"}>
        <div className={"dx-card"}>
          <DataGrid
            ref={dataGrid}
            dataSource={listSavingCustomerStore}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={true}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
          >
            <Scrolling showScrollbar={"always"} />
            <FilterRow visible={true} />
            <Column
              width={80}
              alignment={"center"}
              dataField={"seqId"}
              caption={"#Nomor Anggota"}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                  <OnClickLink
                    onClick={() => navigate(`/saving/customer/detail?id=${options.data.id}`)}
                  >
                    {options.data.seqId}
                  </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
            />
            <Column
              dataField={"name"}
              caption={"Nama Anggota"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"contactPhone"}
              caption={"Nomor HP"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"ktp"}
              caption={"Nomor KTP"}
              filterOperations={filterOperation.string}
            />
            <Column
              width={100}
              dataField={"lastTransactionOn"}
              caption={"Terakhir Transaksi"}
              dataType="date"
              format="dd MMM yyyy HH:mm:ss"
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
            />
            <Column
              dataField={"balanceSaving"}
              caption={"Saldo Simpanan"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              dataField={"balanceDeposit"}
              caption={"Saldo Deposito"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              dataField={"balanceTotal"}
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
