import React, {FC, useRef} from "react";
import {useNavigate} from "react-router";
import DataGrid, {Column, ColumnChooser, FilterRow, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {listStore} from "../../api/message_log";
import {filterOperation} from "../../constants/FilterOperation";
import {downloadExcel} from "../../api/http.api";
import * as downloadFile from "save-file";

export const MessageLogPage: FC = () => {
    const navigate = useNavigate();
    const dataGrid = useRef();
    const onClickDownload = (e: any) => {
        let instance = dataGrid.current?.instance;
        let fileName = `riwayat-pesan.xlsx`;
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
        downloadExcel(`/api/trx/message/log`, paramSearch)
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
        <h2 className={"content-block"}>Riwayat Pesan</h2>
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
                        dataField={"tag"}
                        caption={"Tag"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"destination"}
                        caption={"Kirim ke"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                      dataField={"vendorStatusGroupName"}
                      caption={"Status"}
                      filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"content"}
                        caption={"Pesan"}
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