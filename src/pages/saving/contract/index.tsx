import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { listSavingContractStore } from "src/api/saving";
import { OnClickLink } from "src/components/alink";
import { ApplicationStatus } from "src/components/application-status";
import { filterOperation } from "src/constants/FilterOperation";
import { calculateFilterExpressionCustom } from "src/utils/devExtremeUtils";

export default function SavingContract() {
  const navigate = useNavigate();
  const dataGrid = useRef<DataGrid>(null);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Perjanjian Simpanan</h2>
      <div className={"content-block"}>
        <div className={"dx-card"}>
          <DataGrid
            ref={dataGrid}
            dataSource={listSavingContractStore}
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
                    onClick={() => navigate(`/saving/contract/detail?id=${options.data.id}`)}
                  >
                    {options.data.seqId}
                  </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
            />
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
              dataField={"statusName"}
              caption={"Status"}
              filterOperations={filterOperation.string}
              cellRender={ApplicationStatus}
            />
            <Column
              dataField={"contactName"}
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
              dataField={"accrualInterest"}
              caption={"Jumlah Bunga"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              alignment={"center"}
              dataField={"appSeqId"}
              caption={"#Nomor Pengajuan"}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                  <OnClickLink
                    onClick={() => navigate(`/saving/application/form?id=${options.data.appId}`)}
                  >
                    {options.data.appSeqId}
                  </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
            />

            <Paging defaultPageSize={50} />
            <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
