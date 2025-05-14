import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import React, { useRef } from "react";
import { ApplicationStatus } from "src/components/application-status";
import { filterOperation } from "src/constants/FilterOperation";
import { backofficeAccess } from "src/constants/variableConstata";
import { useAuth } from "src/contexts/auth";
import { calculateFilterExpressionCustom } from "src/utils/devExtremeUtils";

export default function SavingContract() {
  const { user } = useAuth();
  const dataGrid = useRef<DataGrid>(null);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Perjanjian Simpanan</h2>
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
            editing={{
              allowUpdating: (options: any) => {
                let allowAccess =
                  typeof user?.userAccess !== "undefined" &&
                  user?.userAccess.some(
                    (access: string) => access === backofficeAccess.backoffice_application_canceling
                  );
                return options.row.data.statusIsActive && allowAccess;
              }
            }}
          >
            <Scrolling showScrollbar={"always"} />
            <FilterRow visible={true} />
            <Column dataField={"id"} caption={"ID"} filterOperations={filterOperation.string} />
            <Column
              dataField={"startOn"}
              caption={"Tanggal Mulai"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
            />
            <Column
              dataField={"finishOn"}
              caption={"Tanggal Selesai"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
            />
            <Column
              dataField={"status"}
              caption={"Status"}
              filterOperations={filterOperation.string}
              cellRender={ApplicationStatus}
            />
            <Column
              dataField={"name"}
              caption={"Nama Anggota"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"amount"}
              caption={"Jumlah Simpanan Pokok"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              dataField={"amount"}
              caption={"Jumlah Bunga"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"term"}
              caption={"#Nomor Pengajuan"}
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
