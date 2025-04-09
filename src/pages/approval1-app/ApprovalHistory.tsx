import DataGrid, { Button, Column, Pager, Paging } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { FC, useCallback, useRef } from "react";
import { approvalHistoryStore, retryApprovalHistory } from "../../api/approval1";
import { filterOperation } from "../../constants/FilterOperation";

export const ApprovalHistory: FC<any> = ({ id }) => {
  const historyListStoreRef = useRef(new DataSource(approvalHistoryStore(id)));
  const historyListStore = historyListStoreRef.current;

  const refreshData = useCallback(() => {
    historyListStoreRef.current.reload();
  }, []);

  const handleretryApprovalHistory = async (type: string) => {
    await retryApprovalHistory(type, id);
    refreshData();
  };

  return (
    <>
      <div className="dx-form-group-with-caption mb14">
        <span className="dx-form-group-caption">Histori Persetujuan</span>
      </div>
      <DataGrid
        dataSource={historyListStore}
        focusedRowEnabled={true}
        remoteOperations={true}
        columnAutoWidth={true}
        wordWrapEnabled={false}
        showBorders={true}
        dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
        repaintChangesOnly={true}
      >
        <Column
          alignment={"center"}
          dataField={"seqId"}
          caption={"No."}
          width={100}
          sortOrder={"asc"}
        />
        <Column
          dataField={"createdOn"}
          caption={"Tanggal Dibuat"}
          dataType={"date"}
          format={"dd MMM yyyy HH:mm:ss"}
          calculateFilterExpression={function (
            value: any,
            selectedFilterOperations: any,
            target: any
          ) {
            const column = this as any;
            return column.defaultCalculateFilterExpression.apply(this, [
              new Date(value),
              selectedFilterOperations,
              target
            ]);
          }}
          filterOperations={filterOperation.date}
        />
        <Column
          dataField={"modifiedOn"}
          caption={"Tanggal Diubah"}
          dataType={"date"}
          format={"dd MMM yyyy HH:mm:ss"}
          calculateFilterExpression={function (
            value: any,
            selectedFilterOperations: any,
            target: any
          ) {
            const column = this as any;
            return column.defaultCalculateFilterExpression.apply(this, [
              new Date(value),
              selectedFilterOperations,
              target
            ]);
          }}
          filterOperations={filterOperation.date}
        />
        <Column dataField={"typeName"} caption={"Tipe Dokumen"} />
        <Column dataField={"description"} caption={"Deskripsi"} encodeHtml={false} cssClass="pre-line" />
        <Column dataField={"statusName"} caption={"Status"} />
        <Column dataField={"processedByName"} caption={"Diproses Oleh"} />
        <Column dataField={"rejectReason"} caption={"Alasan Ditolak"} encodeHtml={false} cssClass="pre-line" />
        <Column type="buttons">
          <Button
            icon="refresh"
            hint="Retry"
            visible={({ row }) => 
              row?.data?.statusIsRetry && ["Get CBI Data", "SEON Check"].some(type => row?.data?.typeName?.includes(type))
            }            
            onClick={async (e) => {
              const type = e.row?.data?.typeName;
              if (!type) return;

              const retryType = type.includes("Get CBI Data") ? "cbi" : "seon";
              await handleretryApprovalHistory(retryType);
            }}
          />
        </Column>

        <Paging defaultPageSize={50} />
        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
      </DataGrid>
    </>
  );
};
