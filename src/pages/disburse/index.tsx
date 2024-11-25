import React, {FC, useRef} from "react";
import DataGrid, {
    Column,
    FilterRow,
    Item,
    Pager,
    Paging,
    Scrolling,
    Toolbar,
    ColumnChooser
} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import {listStore} from "../../api/disburse";
import {useNavigate} from "react-router";
import {downloadExcel} from "../../api/http.api";
import * as downloadFile from "save-file";

export const DisbursePage: FC = () => {
    const navigate = useNavigate();
    const dataGrid = useRef();
    const onClickDownload = (e: any) => {
        let instance = dataGrid.current?.instance;
        let fileName = `pencairan.xlsx`;
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
        downloadExcel(`api/trx/disburse`, paramSearch)
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
        <h2 className={"content-block"}>Pencairan</h2>
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
                        dataField={"contactName"}
                        caption={"Nama"}
                        width={190}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"contactPhone"}
                        caption={"No. HP"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"contactEmail"}
                        caption={"Email"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"statusName"}
                        caption={"Status"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"amount"}
                        caption={"Jumlah Pencairan"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        dataField={"productName"}
                        caption={"Produk"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"vendorMsg"}
                        caption={"Vendor Message"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"vendorStatus"}
                        caption={"Vendor Status"}
                        filterOperations={filterOperation.string}
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
