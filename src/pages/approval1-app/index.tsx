import React, {useRef} from "react";
import "devextreme/data/odata/store";
import DataGrid, {
    Column,
    Pager,
    Paging,
    FilterRow,
    Toolbar,
    Scrolling,
    Item,
} from "devextreme-react/data-grid";

import {Button} from "devextreme-react/button";
import {useNavigate} from "react-router";
import {filterOperation} from "../../constants/FilterOperation";
import {
    listStore,
} from "src/api/approval1";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../components/alink";
import {downloadExcel} from "../../api/http.api";
import * as downloadFile from "save-file";

export default function Index() {
    const navigate = useNavigate();
    const seqIdRender = (rowData: any) => {
        return (<Button
                text={String(rowData.value)}
                onClick={() => navigate(`/approval1/detail?id=${rowData.data.id}`)}
            />);
    };

    const dataGrid = useRef();
    const onClickDownload = (e: any) => {
        let instance = dataGrid.current?.instance;
        let fileName = `persetujuan-oleh-partner.xlsx`;
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
        downloadExcel(`api/trx/approval/manual/1`, paramSearch)
            .then((response) => {
                downloadFile(response, fileName);
            })
            .catch(console.error);
        console.log(paramSearch);
    }

    return (<React.Fragment>
        <h2 className={"content-block"}>Persetujuan oleh partner</h2>
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
                >
                    <Toolbar>
                        <Item location="after">
                            <Button
                                text="Download"
                                type="success"
                                stylingMode="contained"
                                onClick={onClickDownload}
                            />
                        </Item>
                    </Toolbar>
                    <Scrolling showScrollbar={"always"}/>
                    <FilterRow visible={true}/>
                    <Column
                        alignment={"center"}
                        dataField={"seqId"}
                        caption={"#No"}
                        width={90}
                        cellTemplate={function (container: any, options: any) {
                            const dom = ReactDOM.createRoot(container);
                            dom.render(<OnClickLink
                                          onClick={() => navigate(`/approval1/detail?id=${options.data.id}`)}>{options.data.seqId}</OnClickLink>);
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
                        dataField={"productName"}
                        caption={"Produk"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"requestedAmount"}
                        caption={"Jumlah Pengajuan"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        dataField={"statusName"}
                        caption={"Status"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"termNameRequested"}
                        caption={"Jangka Waktu"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"monthlyIncome"}
                        caption={"Penghasilan Perbulan"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        alignment={"center"}
                        dataField={"contactIdSeq"}
                        caption={"#No.Kontak"}
                        cellTemplate={function (container: any, options: any) {
                            const dom = ReactDOM.createRoot(container);
                            dom.render(<OnClickLink
                                onClick={() => navigate(`/contact/detail?id=${options.data.contactId}`)}>{options.data.contactIdSeq}</OnClickLink>);
                        }}
                        filterOperations={filterOperation.numeric}
                    />
                    <Column
                        dataField={"contactName"}
                        caption={"Nama Lengkap"}
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
                        dataField={"bankName"}
                        caption={"Bank"}
                        alignment={"left"}
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
    </React.Fragment>);
}
