import React, {FC, useRef} from "react";
import DataGrid, {Column, ColumnChooser, FilterRow, Pager, Paging} from "devextreme-react/data-grid";
import {listStore} from "../../api/transaction";
import {filterOperation} from "../../constants/FilterOperation";
import {downloadExcel} from "../../api/http.api";
import * as downloadFile from "save-file";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../components/alink";
import {useNavigate} from "react-router";

export const TransactionPage: FC = () => {
    const navigate = useNavigate();
    const dataGrid: any = useRef();
    const onClickDownload = (e: any) => {
        let instance = dataGrid.current?.instance;
        let fileName = `transaksi-akun.xlsx`;
        let columns = [];
        let captions = [];
        const visibleColums = instance.getVisibleColumns();
        visibleColums.filter(function (val) {
            if (val.dataField != null) {
                columns.push(val.dataField);
            }
            if (val.caption != null) {
                captions.push(val.caption);
            }
        });

        const filter = instance.getCombinedFilter(true) || [];
        let paramSearch = {
            columns: JSON.stringify(columns),
            captions: JSON.stringify(captions),
            searchQuery: JSON.stringify(filter),
        };
        downloadExcel(`/api/trx/transaction`, paramSearch)
            .then((response) => {
                downloadFile(response, fileName);
            })
            .catch(console.error);
        console.log(paramSearch);
    }

    const onToolbarPreparing = (e: any) => {
        const items = e.toolbarOptions.items;
        items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                text: "Download",
                type: "success",
                stylingMode: "contained",
                hint: 'Download',
                onClick: onClickDownload,
            },
        });
    }
    return (<>
        <h2 className={"content-block"}>Transaksi Akun</h2>
        <div className={"content-block"}>
            <div className={"dx-card"}>
                <DataGrid
                    ref={dataGrid}
                    dataSource={listStore}
                    focusedRowEnabled={true}
                    remoteOperations={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={false}
                    showBorders={true}
                    dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                    repaintChangesOnly={true}
                    onToolbarPreparing={onToolbarPreparing}
                >
                    <ColumnChooser
                        enabled={true}
                        mode={'select'}
                    />
                    <FilterRow visible={true}/>
                    <Column
                        alignment={"center"}
                        dataField={"seqId"}
                        caption={"#NO"}
                        width={90}
                        filterOperations={filterOperation.numeric}
                    />
                    <Column
                        dataField={"transactionDate"}
                        caption={"Tanggal"}
                        dataType={"date"}
                        format={"dd MMM yyyy"}
                        calculateFilterExpression={function (
                            value: any,
                            selectedFilterOperations: any,
                            target: any
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
                        dataField={"transactionType"}
                        caption={"Tipe"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"accountName"}
                        caption={"Akun"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"amount"}
                        caption={"Nominal"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        dataField={"statusName"}
                        caption={"Status"}
                        alignment={"center"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"contractSeqId"}
                        caption={"No. Kontrak"}
                        alignment={"center"}
                        cellTemplate={function (container: any, options: any) {
                            const dom = ReactDOM.createRoot(container);
                            dom.render(<OnClickLink
                                onClick={() => navigate(`/contract/detail?id=${options.data.contractId}`)}>{options.data.contractSeqId}</OnClickLink>);
                        }}
                        filterOperations={filterOperation.numeric}
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
                                target,
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
                                target,
                            ]);
                        }}
                        filterOperations={filterOperation.date}
                    />
                    <Column
                        dataField={"paymentDueDate"}
                        caption={"Jatuh Tempo"}
                        dataType={"date"}
                        format={"dd MMM yyyy"}
                        calculateFilterExpression={function (
                            value: any,
                            selectedFilterOperations: any,
                            target: any
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
                        dataField={"branchName"}
                        caption={"Cabang"}
                        alignment={"left"}
                        filterOperations={filterOperation.string}
                    />
                    <Paging defaultPageSize={50}/>
                    <Pager
                        showPageSizeSelector={true}
                        showInfo={true}
                        allowedPageSizes={[10, 50, 100]}
                    />
                </DataGrid>
            </div>
        </div>
    </>);
}
