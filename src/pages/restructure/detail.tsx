import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {getDetail} from "../../api/restructure_v2";
import * as Title from "devextreme-react/toolbar";
import Form, {
    SimpleItem, GroupItem, TabbedItem, TabPanelOptions, Tab,
} from 'devextreme-react/form';
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import {DataGrid} from "devextreme-react";
import {formatRupiah} from "../../utils/string.util";


export const RestructureDetailPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);

    const [restructure, setRestructure] = useState<any>({});

    useEffect(() => {
        getDetail(id).then(rs => {
            console.log("detail restructure ", rs);
            setRestructure(rs);
        });
    }, []);

    return (<>
            <h2 className={'content-block'}>Restructure No# {restructure?.seqId}</h2>
            <div className={'content-block'}>
                <Title.Toolbar className={"dx-card"}>
                    <Title.Item
                        location="before"
                        widget="dxButton"
                        options={{
                            icon: "back",
                            text: "Kembali",
                            onClick: () => {
                                navigate(-1);
                            },
                        }}
                    />
                </Title.Toolbar>
                <div className="form__tabs">
                    <Form colCount={1} id="contractForm"
                          formData={restructure}>
                        <GroupItem colCount={2} cssClass={"dx-card responsive-paddings"}>
                            <GroupItem colCount={1} caption={"Balance"}>
                                <SimpleItem>Principle Amount : {formatRupiah(restructure.principalAmount)} </SimpleItem>
                                <SimpleItem>Interest Amount : {formatRupiah(restructure.interestAmount)} </SimpleItem>
                                <SimpleItem>Sanction : {formatRupiah(restructure.penaltyAmount)} </SimpleItem>
                                <SimpleItem>Restructure Amount : {formatRupiah(restructure.restructureAmount)} </SimpleItem>
                            </GroupItem>
                            <GroupItem colCount={1} caption={"Balance"}>

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
                                <Scrolling showScrollbar={"always"} />
                                <Column dataField={"period"} caption={"Cicilan Ke."} alignment={"center"} width={100} />
                                <Column
                                    dataField={"paymentDate"}
                                    caption={"Payment Date"}
                                    dataType={"date"}
                                    format={"dd MMM yyyy"}
                                    calculateFilterExpression={(
                                        value: any,
                                        selectedFilterOperations: any,
                                        target: any
                                    )=> {
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
                                <Paging defaultPageSize={50} />
                                <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
                            </DataGrid>
                        </GroupItem>
                    </Form>
                </div>
            </div>
        </>
    );
}