import React, {FC, useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import * as Title from "devextreme-react/toolbar";
import Form, {ButtonItem, CustomRule, GroupItem, PatternRule, SimpleItem} from "devextreme-react/form";
import {formatRupiah} from "../../utils/string.util";
import {DataGrid} from "devextreme-react";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import "./style.scss";


export const RestructureDetailV1FormPage = (props: any) => {
    const {restructure} = props;
    const navigate = useNavigate();
    return <>
        <form className="form__tabs">
            <Form
                colCount={2}
                id="restructureCreateForm"
                formData={restructure}
            >
                <GroupItem colSpan={2} caption={restructure.categoryName} colCount={2}
                           cssClass={"dx-card responsive-paddings next-card"}>
                    <GroupItem>
                        <SimpleItem>
                            Restructure Active : {restructure.isActive ? "true" : "false"}
                        </SimpleItem>
                        <SimpleItem>
                            Restructure Status : {restructure.statusName}
                        </SimpleItem>
                        <SimpleItem>
                            No. Pinjaman : {restructure.contractNumber}
                        </SimpleItem>
                        <SimpleItem>
                            Principal Amount
                            : {restructure.principalAmount && formatRupiah(restructure.principalAmount)}
                        </SimpleItem>
                        <SimpleItem>
                            Interest Amount : {restructure.interestAmount && formatRupiah(restructure.interestAmount)}
                        </SimpleItem>
                        <SimpleItem>
                            Sanctions : {restructure.penaltyAmount && formatRupiah(restructure.penaltyAmount)}
                        </SimpleItem>
                    </GroupItem>
                    <GroupItem>
                        <GroupItem colCount={2}>
                            <SimpleItem
                                dataField="removeSanction"
                                editorType="dxSwitch"
                                label={{text: " ", showColon: false}}
                                editorOptions={{
                                    switchedOnText: 'On',
                                    switchedOffText: 'Off',
                                    readOnly: true,
                                }}
                            >
                            </SimpleItem>
                        </GroupItem>

                        <SimpleItem
                            dataField="discount"
                            label={{text: "Diskon, %"}}
                            editorOptions={{
                                value: restructure.discount * 100,
                                readOnly: true,
                            }}
                        />
                        <SimpleItem
                            dataField="initialPayment"
                            label={{text: "Initial payment"}}
                            editorType={"dxNumberBox"}
                            editorOptions={{
                                readOnly: true,
                                format: "Rp #,##0",
                            }}
                        />
                    </GroupItem>

                    <SimpleItem colSpan={2} >
                        <div className="restrutureAmountPopV2">Restructure Amount
                            : {restructure.restructureAmount && formatRupiah(restructure.restructureAmount)}</div>
                    </SimpleItem>
                </GroupItem>
                {/*<GroupItem colSpan={2} caption={"Repayment Setting"} colCount={1}*/}
                {/*           cssClass={"dx-card responsive-paddings next-card"}>*/}
                {/*    <GroupItem>*/}
                {/*        <SimpleItem*/}
                {/*            dataField="firstPaymentDate"*/}
                {/*            label={{text: "First Payment Date"}}*/}
                {/*            editorOptions={{*/}
                {/*                width: "50%",*/}
                {/*                displayFormat: "dd MMM yyyy",*/}
                {/*                min: new Date(),*/}
                {/*                type: "date",*/}
                {/*                readOnly: true,*/}
                {/*            }}*/}
                {/*            editorType="dxDateBox"*/}
                {/*        />*/}
                {/*        <SimpleItem*/}
                {/*            dataField="frequencyName"*/}
                {/*            label={{text: "Frequency"}}*/}
                {/*            editorOptions={{*/}
                {/*                width: "50%",*/}
                {/*                readOnly: true,*/}
                {/*            }}*/}
                {/*        >*/}
                {/*        </SimpleItem>*/}
                {/*        <GroupItem colCount={2}>*/}
                {/*            <SimpleItem*/}
                {/*                dataField="paymentAmount"*/}
                {/*                label={{text: "Payment amount"}}*/}
                {/*                editorType={"dxNumberBox"}*/}
                {/*                editorOptions={{*/}
                {/*                    readOnly: true,*/}
                {/*                    format: "Rp #,##0",*/}
                {/*                }}*/}
                {/*            />*/}
                {/*            <SimpleItem cssClass="topPadding25">*/}
                {/*                <div className={"bgDesc"}>Min. 400.000</div>*/}
                {/*            </SimpleItem>*/}
                {/*        </GroupItem>*/}
                {/*        <GroupItem colCount={2}>*/}
                
                {/*            <SimpleItem*/}
                {/*                dataField="paymentPeriod"*/}
                {/*                label={{text: "Payment period"}}*/}
                {/*                editorOptions={{*/}
                {/*                    readOnly: true,*/}
                {/*                }}*/}
                {/*            />*/}
                {/*            <SimpleItem cssClass="topPadding25">*/}
                {/*                <div className="bgDesc">Max : 3years</div>*/}
                {/*            </SimpleItem>*/}
                {/*        </GroupItem>*/}
                {/*    </GroupItem>*/}
                {/*    /!*<GroupItem>&nbsp;</GroupItem>*!/*/}
                {/*</GroupItem>*/}
                {/*<GroupItem colSpan={2} caption={"Schedule"} colCount={1}*/}
                {/*           cssClass={"dx-card responsive-paddings next-card"}>*/}
                {/*    <DataGrid*/}
                {/*        dataSource={restructure?.schedule}*/}
                {/*        remoteOperations={true}*/}
                {/*        columnAutoWidth={true}*/}
                {/*        wordWrapEnabled={false}*/}
                {/*        showBorders={true}*/}
                {/*        dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}*/}
                {/*        repaintChangesOnly={true}*/}
                {/*    >*/}
                {/*        <Scrolling showScrollbar={"always"}/>*/}
                {/*        <Column dataField={"period"} caption={"Cicilan Ke."} alignment={"center"} width={100}/>*/}
                {/*        <Column*/}
                {/*            dataField={"paymentDate"}*/}
                {/*            caption={"Payment Date"}*/}
                {/*            dataType={"date"}*/}
                {/*            format={"dd MMM yyyy"}*/}
                {/*            calculateFilterExpression={(*/}
                {/*                value: any,*/}
                {/*                selectedFilterOperations: any,*/}
                {/*                target: any*/}
                {/*            ) => {*/}
                {/*                const column = this as any;*/}
                {/*                return column.defaultCalculateFilterExpression.apply(this, [*/}
                {/*                    new Date(value),*/}
                {/*                    selectedFilterOperations,*/}
                {/*                    target,*/}
                {/*                ]);*/}
                {/*            }}*/}
                {/*            filterOperations={filterOperation.date}*/}
                {/*        />*/}
                {/*        <Column dataField={"paymentAmount"} caption={"Payment Amount"}*/}
                {/*                format="Rp #,##0.00"/>*/}
                {/*        <Column dataField={"principalPayment"} caption={"Principle Amount"}*/}
                {/*                format="Rp #,##0.00"/>*/}
                {/*        <Column dataField={"interestPayment"} caption={"Interest"}*/}
                {/*                format="Rp #,##0.00"/>*/}
                {/*        <Column dataField={"remainingBalance"} caption={"Remaining Amount"}*/}
                {/*                format="Rp #,##0.00"/>*/}
                {/*        <Paging defaultPageSize={50}/>*/}
                {/*        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]}/>*/}
                {/*    </DataGrid>*/}
                {/*</GroupItem>*/}
            </Form>
        </form>
    </>
}
