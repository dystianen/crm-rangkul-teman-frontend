import Form, {GroupItem, SimpleItem} from "devextreme-react/form";
import {formatRupiah} from "../../utils/string.util";
import {formatOnlyDateMonthYear} from "../../utils/dateUtils";
import {DataGrid} from "devextreme-react";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import React from "react";


export const RestructureFormV2 = (props: any) => {
    const {restructure} = props;

    return <>
        <Form colCount={1} id="contractForm"
              formData={restructure}>
            <GroupItem colCount={2} cssClass={"dx-card responsive-paddings"}>
                <GroupItem colCount={1} caption={"Informasi"}>
                    <SimpleItem>Tipe : {restructure.categoryName} </SimpleItem>
                    <SimpleItem>No.Pinjaman : {restructure.contractNumber} </SimpleItem>
                    <SimpleItem>Remove Sanction : {restructure.removeSanction ? "true" : "false"} </SimpleItem>
                    <SimpleItem>Diskon : {restructure.discount} %</SimpleItem>
                    <SimpleItem>Initial Payment : {formatRupiah(restructure.initialPayment)} </SimpleItem>
                    <SimpleItem>Principle Amount : {formatRupiah(restructure.principalAmount)} </SimpleItem>
                    <SimpleItem>Interest Amount : {formatRupiah(restructure.interestAmount)} </SimpleItem>
                    <SimpleItem>Sanction : {formatRupiah(restructure.penaltyAmount)} </SimpleItem>
                    <SimpleItem>Restructure Amount : {formatRupiah(restructure.restructureAmount)} </SimpleItem>
                </GroupItem>
                <GroupItem colCount={1} caption={"Repayment Settings"}>
                    <SimpleItem>First Payment Date : {formatOnlyDateMonthYear(restructure.firstPaymentDate)} </SimpleItem>
                    <SimpleItem>Payment Frequency : {restructure.frequencyName} </SimpleItem>
                    <SimpleItem>Payment Amount : {formatRupiah(restructure.paymentAmount)} </SimpleItem>
                    <SimpleItem>Payment Period : {restructure.paymentPeriod} </SimpleItem>
                </GroupItem>
            </GroupItem>
            <GroupItem colCount={1} caption="Schedule"
                       cssClass={"dx-card responsive-paddings"}>
                <DataGrid
                    dataSource={restructure?.schedule}
                    remoteOperations={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={false}
                    showBorders={true}
                    dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                    repaintChangesOnly={true}
                >
                    <Scrolling showScrollbar={"always"}/>
                    <Column dataField={"period"} caption={"Cicilan Ke."} alignment={"center"} width={100}/>
                    <Column
                        dataField={"paymentDate"}
                        caption={"Payment Date"}
                        dataType={"date"}
                        format={"dd MMM yyyy"}
                        calculateFilterExpression={(
                            value: any,
                            selectedFilterOperations: any,
                            target: any
                        ) => {
                            const column = this as any;
                            return column.defaultCalculateFilterExpression.apply(this, [
                                new Date(value),
                                selectedFilterOperations,
                                target,
                            ]);
                        }}
                        filterOperations={filterOperation.date}
                    />
                    <Column dataField={"paymentAmount"} caption={"Payment Amount"}
                            format="Rp #,##0.00"/>
                    <Column dataField={"principalPayment"} caption={"Principle Amount"}
                            format="Rp #,##0.00"/>
                    <Column dataField={"interestPayment"} caption={"Interest"}
                            format="Rp #,##0.00"/>
                    <Column dataField={"remainingBalance"} caption={"Remaining Amount"}
                            format="Rp #,##0.00"/>
                    <Paging defaultPageSize={50}/>
                    <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]}/>
                </DataGrid>
            </GroupItem>
        </Form>
    </>
}