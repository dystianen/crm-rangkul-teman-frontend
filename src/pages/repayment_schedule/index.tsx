import React, {FC, useRef} from "react";
import {useNavigate} from "react-router";
import DataGrid, {
    Column, ColumnChooser, FilterRow, Pager, Paging,
    FilterPanel,
    CustomOperation,
    FilterBuilder,
    FilterBuilderPopup,
    Scrolling, Item, Toolbar
} from "devextreme-react/data-grid";
import {listStore} from "../../api/payment_schedule";
import {filterOperation} from "../../constants/FilterOperation";
import {ContractStatus} from "../../components/contract-status";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../components/alink";
import {midPop} from "../../constants/PopupSize";
import {Button} from "devextreme-react/button";
import {downloadExcel} from "../../api/http.api";
import * as downloadFile from "save-file";

export const RepaymentSchedulePage: FC = () => {
    const navigate = useNavigate();
    const dataGrid = useRef();
    const onClickDownload = (e: any) => {
        let instance = dataGrid.current?.instance;
        let fileName = `jadwal-pembayaran.xlsx`;
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
        downloadExcel(`/api/trx/payment/schedule`, paramSearch)
            .then((response) => {
                downloadFile(response, fileName);
            })
            .catch(console.error);
        console.log(paramSearch);
    }

    const onToolbarPreparing = (e: any) => {
        let instance = dataGrid.current?.instance;
        const items = e.toolbarOptions.items;
        items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                hint: 'Pencarian',
                icon: 'filter',
                onClick: function (e: any) {
                    instance.option('filterBuilderPopup.visible', true);
                },
            },
        });
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
        <h2 className={"content-block"}>Jadwal Pembayaran</h2>
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
                    <FilterPanel visible={true}/>
                    <FilterBuilderPopup
                        position={'center'}
                        title={"Pencarian"}
                        width={midPop.width}
                        height={midPop.height}
                    />
                    <FilterBuilder
                        allowHierarchicalFields={true}
                        maxGroupLevel={0}
                        groupOperations={[
                            'and',
                            'or',
                        ]}
                    >
                        <CustomOperation name={'='} caption={'='}/>
                        <CustomOperation name={'<='} caption={'≤'}/>
                        <CustomOperation name={'>='} caption={'≥'}/>
                        <CustomOperation name={'<>'} caption={'!='}/>
                    </FilterBuilder>
                    <Column
                        alignment={"center"}
                        dataField={"contractSeqId"}
                        caption={"#No Pinjaman"}
                        cellTemplate={function (container: any, options: any) {
                            const dom = ReactDOM.createRoot(container);
                            dom.render(<OnClickLink
                                onClick={() => navigate(`/contract/detail?id=${options?.data?.contractId}`)}>{options.data.contractSeqId}</OnClickLink>);
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
                        dataField={"statusName"}
                        caption={"Status"}
                        filterOperations={filterOperation.string}
                        cellRender={ContractStatus}
                    />
                    <Column
                        dataField={"dueDate"}
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
                        dataField={"dpdRunning"}
                        caption={"DPD Running"}
                        filterOperations={filterOperation.numeric}
                    />
                    <Column
                        alignment={"center"}
                        dataField={"seq"}
                        caption={"Angsuran Ke."}
                        filterOperations={filterOperation.numeric}
                    />
                    <Column
                        dataField={"amount"}
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
                        dataField={"amountBalance"}
                        caption={"Saldo"}
                        filterOperations={filterOperation.numeric}
                        format="Rp #,##0.00"
                    />
                    <Column
                        dataField={"flag"}
                        caption={"Flag"}
                        filterOperations={filterOperation.numeric}
                        visible={false}
                    />
                    <Column
                        dataField={"contactName"}
                        caption={"Nama"}
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
                        visible={false}
                    />
                    <Column
                        dataField={"contactVa"}
                        caption={"VA No."}
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
