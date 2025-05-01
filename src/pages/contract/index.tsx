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
import {listStore} from "../../api/contract";
import ReactDOM from "react-dom/client";
import {useNavigate} from "react-router";
import {OnClickLink} from "../../components/alink";
import {ContractStatus} from "../../components/contract-status";
import {downloadExcel} from "../../api/http.api";
import * as downloadFile from "save-file";
import {Button} from "devextreme-react/button";
import {calculateFilterExpressionCustom} from "../../utils/devExtremeUtils";

export const ContractPage: FC = () => {
    const navigate = useNavigate();
    const dataGrid: any = useRef();
    const onClickDownload = (e: any) => {
        let instance = dataGrid.current?.instance;
        let fileName = `pinjaman.xlsx`;
        let columns: any[] = [];
        let captions: any[] = [];
        const visibleColums = instance.getVisibleColumns();
        visibleColums.filter(function (val: any) {
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
        downloadExcel(`api/trx/contract`, paramSearch)
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
        <h2 className={"content-block"}>Pinjaman</h2>
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
                        caption={"#No"}
                        width={90}
                        cellTemplate={function (container: any, options: any) {
                            const dom = ReactDOM.createRoot(container);
                            dom.render(<OnClickLink
                                onClick={() => navigate(`/contract/detail?id=${options.data.id}`)}>{options.data.seqId}</OnClickLink>);
                        }}
                        filterOperations={filterOperation.numeric}
                    />
                    <Column
                        dataField={"createdOn"}
                        caption={"Tanggal Dibuat"}
                        dataType={"date"}
                        format={"dd MMM yyyy HH:mm:ss"}
                        calculateFilterExpression={calculateFilterExpressionCustom}
                        filterOperations={filterOperation.date}
                    />
                    <Column
                        dataField={"modifiedOn"}
                        caption={"Tanggal Diubah"}
                        dataType={"date"}
                        format={"dd MMM yyyy HH:mm:ss"}
                        calculateFilterExpression={calculateFilterExpressionCustom}
                        filterOperations={filterOperation.date}
                    />
                    <Column
                        dataField={"productName"}
                        caption={"Produk"}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"contactName"}
                        caption={"Nama Lengkap"}
                        width={190}
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        alignment={"center"}
                        dataField={"appSeqId"}
                        caption={"#No.Pengajuan"}
                        cellTemplate={function (container: any, options: any) {
                            const dom = ReactDOM.createRoot(container);
                            dom.render(<OnClickLink
                                onClick={() => navigate(`/loan-app/detail?id=${options.data.appId}`)}>{options.data.appSeqId}</OnClickLink>);
                        }}
                        filterOperations={filterOperation.numeric}
                    />
                    <Column
                        dataField={"contactPhone"}
                        caption={"No. HP"}
                        filterOperations={filterOperation.string}
                        visible={false}
                    />
                    <Column
                        dataField={"contactEmail"}
                        caption={"Email"}
                        filterOperations={filterOperation.string}
                        visible={false}
                    />
                    <Column
                        dataField={"bankName"}
                        caption={"Bank"}
                        alignment={"left"}
                        filterOperations={filterOperation.string}
                        visible={false}
                    />
                    <Column
                        dataField={"startOn"}
                        caption={"Dimulai"}
                        dataType={"date"}
                        format={"dd MMM yyyy"}
                        calculateFilterExpression={calculateFilterExpressionCustom}
                        filterOperations={filterOperation.date}
                    />
                    <Column
                        dataField={"finishOn"}
                        caption={"Berakhir"}
                        dataType={"date"}
                        format={"dd MMM yyyy"}
                        calculateFilterExpression={calculateFilterExpressionCustom}
                        filterOperations={filterOperation.date}
                    />
                    <Column
                        dataField={"statusName"}
                        caption={"Status"}
                        filterOperations={filterOperation.string}
                        cellRender={ContractStatus}
                    />
                    <Column
                        dataField={"dpdCurrent"}
                        caption={"DPD"}
                        filterOperations={filterOperation.numeric}
                    />
                    <Column
                        dataField={"dpdMax"}
                        caption={"DPD Max"}
                        filterOperations={filterOperation.numeric}
                    />
                    <Column
                        dataField={"amountDisburse"}
                        caption={"Jumlah Pencairan"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        dataField={"amountProvision"}
                        caption={"Jumlah Provision"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        dataField={"amountPrinciple"}
                        caption={"Jumlah Pokok"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        dataField={"amountInitialOutstanding"}
                        caption={"Jumlah Pinjaman"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        dataField={"amountPayment"}
                        caption={"Jumlah Bayar"}
                        filterOperations={filterOperation.numeric}
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
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
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
