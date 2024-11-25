import React, {FC} from "react";
import {listScheduleStore} from "../../api/contract";
import DataGrid, {Column, Pager, Paging} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";

export const Schedule: FC<any> = (props) => {
    return <>
        <DataGrid
            dataSource={listScheduleStore(String(props.id))}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={false}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
        >
            <Column alignment={"center"} dataField={"seqId"} caption={"No."} width={100}/>
            <Column visible={false} alignment={"center"} dataField={"seq"} caption={"SEQ"} width={100} sortOrder={"asc"}/>
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
            <Column alignment={"center"} dataField={"seq"} caption={"Cicilan ke."} width={100}/>
            <Column
                dataField={"statusName"}
                caption={"Status"}
            />
            <Column
                dataField={'dueDate'}
                caption={'Jatuh Tempo'}
                dataType={'date'}
                format={'dd MMM yyyy'}
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
            <Column dataField={"dpdCurrent"} caption={"DPD"}/>
            <Column dataField={"dpdMax"} caption={"DPD Max"}/>
            <Column
                dataField={"amount"}
                caption={"Jumlah"}
                format="Rp #,##0.00"
            />
            <Column
                dataField={"amountPayment"}
                caption={"Jumlah Bayar"}
                format="Rp #,##0.00"
            />
            <Column
                dataField={"amountWriteoff"}
                caption={"Jumlah Penghapusan"}
                format="Rp #,##0.00"
            />
            <Column
                dataField={"amountBalance"}
                caption={"Saldo"}
                format="Rp #,##0.00"
            />
            <Paging defaultPageSize={50}/>
            <Pager
                showPageSizeSelector={true}
                showInfo={true}
                allowedPageSizes={[10, 50, 100]}
            />
        </DataGrid>
    </>
}
