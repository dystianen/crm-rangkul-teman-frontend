import {approvalHistoryStore} from "../../api/approval1";
import DataGrid,{Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import React, {FC} from "react";

export const ApprovalHistory: FC<any> = ({id})=>{
    return  <>
        <div className="dx-form-group-with-caption mb14">
            <span className="dx-form-group-caption">Histori Persetujuan</span>
        </div>
        <DataGrid
            dataSource={approvalHistoryStore(String(id))}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={false}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
        >
            <Column alignment={"center"} dataField={"seqId"} caption={"No."} width={100} sortOrder={"asc"}/>
            <Column
                dataField={'createdOn'}
                caption={'Tanggal Dibuat'}
                dataType={'date'}
                format={'dd MMM yyyy HH:mm:ss'}
                calculateFilterExpression={function (
                    value: any,
                    selectedFilterOperations: any,
                    target: any,
                ) {
                    const column = this as any;
                    return column.defaultCalculateFilterExpression.apply(this, [
                        new Date(value),
                        selectedFilterOperations,
                        target,
                    ]);
                }}
                filterOperations={filterOperation.date}
            />
            <Column
                dataField={'modifiedOn'}
                caption={'Tanggal Diubah'}
                dataType={'date'}
                format={'dd MMM yyyy HH:mm:ss'}
                calculateFilterExpression={function (
                    value: any,
                    selectedFilterOperations: any,
                    target: any,
                ) {
                    const column = this as any;
                    return column.defaultCalculateFilterExpression.apply(this, [
                        new Date(value),
                        selectedFilterOperations,
                        target,
                    ]);
                }}
                filterOperations={filterOperation.date}
            />
            <Column dataField={"typeName"} caption={"Tipe Dokumen"}/>
            <Column dataField={"description"} caption={"Deskripisi"}/>
            <Column dataField={"statusName"} caption={"Status"}/>
            <Column dataField={"processedByName"} caption={"Diproses Oleh"}/>
            <Column dataField={"rejectReason"} caption={"Alasan Ditolak"}/>
            <Paging defaultPageSize={50}/>
            <Pager
                showPageSizeSelector={true}
                showInfo={true}
                allowedPageSizes={[10, 50, 100]}
            />
        </DataGrid>
    </>
}