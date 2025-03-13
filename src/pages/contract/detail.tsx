import React, {useEffect, useState} from "react";
import Form, {
    SimpleItem, GroupItem, TabbedItem, TabPanelOptions, Tab,
} from 'devextreme-react/form';
import {DropDownButton} from "devextreme-react";
import * as Title from "devextreme-react/toolbar";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {contractActivityApi, getDetail} from "../../api/contract";
import {Schedule} from "./schedule";
import {ScheduleDetail} from "./schedule-detail";
import {ContractFiles} from "./ContractFiles";
import {AppLoanDetailRequest, initAppLoanDetailValue} from "../../interfaces/appLoanOnboarding";
import {Button} from "devextreme-react/button";
import {RestructurePopup} from "./RestructurePopup";
import {RestructurePopupV2} from "./RestructurePopupV2";

export interface Contract {
    id: string;
    seqId: number;
    createdOn: string;
    modifiedOn: string;
    createdBy: string;
    modifiedBy: string;
    name?: any;
    appId: string;
    statusId: string;
    startOn?: string;
    finishOn?: string;
    statusName: string;
    productId: string;
    productGroupId: string;
    contactId: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    disburseBankId: string;
    bankName: string;
    disburseBankAccName?: any;
    disburseBankAccNumber: string;
    amountPrinciple: number;
    amountInterest?: any;
    amountDisburse: number;
    amountProvision: number;
    amountInitialOutstanding: number;
    dpdCurrent: number;
    dpdMax: number;
    statusIsActive: boolean;
    statusIsInProcess: boolean;
}

export const ContractDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [activity, setActivity] = useState<Array<any>>([]);
    const [popupRestructureVisible, setPopupRestructureVisible] = React.useState(false);
    const [popupRestructureV2Visible, setPopupRestructureV2Visible] = React.useState(false);
    const [detail, setDetail] = useState<any>({
        id: "",
        seqId: 0,
        createdOn: "",
        modifiedOn: "",
        createdBy: "",
        modifiedBy: "",
        name: "",
        appId: "",
        statusId: "",
        startOn: "",
        finishOn: "",
        statusName: "",
        productId: "",
        productGroupId: "",
        contactId: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        disburseBankId: "",
        bankName: "",
        disburseBankAccName: "",
        disburseBankAccNumber: "",
        amountPrinciple: 0,
        amountInterest: 0,
        amountDisburse: 0,
        amountProvision: 0,
        amountInitialOutstanding: 0,
        amountPayment: 0,
        amountBalance: 0,
        dpdCurrent: 0,
        dpdMax: 0,
        statusIsActive: false,
        statusIsInProcess: false,
    });
    const [detailApp, setAppDetail] = useState<AppLoanDetailRequest>(
        initAppLoanDetailValue
    );

    useEffect(() => {
        getDetail(String(id)).then((data) => {
            setDetail(data.contract);
            setAppDetail(data.app);
        });
        contractActivityApi(String(id)).then(data=>{
            setActivity(data);
        });
    }, [id]);


    return (<>
        <div className="title-detail">
            <h2 className={"content-block"}>Detil Kontrak</h2>
            <div>
                <DropDownButton
                    useSelectMode={false}
                    stylingMode="contained"
                    text="Activity"
                    dropDownOptions={{
                        width: 230,
                    }}
                    items={activity}
                    onItemClick={(e) => {
                        if(e.itemData=="Restruktur") {
                            setPopupRestructureVisible(true);
                        } else if(e.itemData=="Restructure 2.0") {
                            setPopupRestructureV2Visible(true);
                        }
                    }}
                    width={230}
                />
            </div>
        </div>
        <div className={"content-block"}>
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
                <Form colCount={2} id="contractForm"
                      formData={detail}>
                    <GroupItem colSpan={2} colCount={2} caption="Informasi"
                               cssClass={"dx-card responsive-paddings"}>
                        <GroupItem>
                            <SimpleItem
                                dataField="seqId"
                                label={{text: "#No. Kontrak"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                dataField="statusName"
                                label={{text: "Status"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                editorType="dxDateBox"
                                dataField="startOn"
                                label={{text: "Dimulai Pada"}}
                                editorOptions={{
                                    displayFormat: 'dd MMM yyyy',
                                    type: 'datetime',
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                editorType="dxDateBox"
                                dataField="finishOn"
                                label={{text: "Berakhir Pada"}}
                                editorOptions={{
                                    displayFormat: 'dd MMM yyyy',
                                    type: 'datetime',
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                dataField="dpdCurrent"
                                label={{text: "DPD"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                dataField="dpdMax"
                                label={{text: "DPD Max"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                        </GroupItem>
                        <GroupItem>
                            <SimpleItem
                                dataField="amountPayment"
                                label={{text: "Jumlah Bayar"}}
                                editorOptions={{
                                    readOnly: true,
                                    format: "Rp #,##0.00",
                                }}
                            />
                            <SimpleItem
                                dataField="amountBalance"
                                label={{text: "Saldo"}}
                                editorOptions={{
                                    readOnly: true,
                                    format: "Rp #,##0.00",
                                }}
                            />
                            <SimpleItem
                                dataField="amountDisburse"
                                label={{text: "Jumlah Pencairan"}}
                                editorOptions={{
                                    readOnly: true,
                                    format: "Rp #,##0.00",
                                }}
                            />
                            <SimpleItem
                                dataField="amountProvision"
                                label={{text: "Jumlah Provision"}}
                                editorOptions={{
                                    readOnly: true,
                                    format: "Rp #,##0.00",
                                }}
                            />
                            <SimpleItem
                                dataField="amountPrinciple"
                                label={{text: "Jumlah Pokok"}}
                                editorOptions={{
                                    readOnly: true,
                                    format: "Rp #,##0.00",
                                }}
                            />
                        </GroupItem>
                    </GroupItem>
                </Form>
            </div>
            <div className={"dx-card responsive-paddings next-card"}>
                <div className="dx-form-group-with-caption mb14" style={{
                    display: "flex",
                    justifyContent: "space-between", alignItems: "center"
                }}>
                    <span className="dx-form-group-caption">Detil Pengajuan</span>
                    <Button icon="textdocument"
                            type="success"
                            onClick={() => navigate(`/loan-app/detail?id=${detailApp.application?.id}`)}/>
                </div>
                <Form
                    colCount={1}
                    formData={detailApp}
                    showColonAfterLabel={true}
                >
                    <GroupItem colSpan={2}>
                        <GroupItem colCount={2}>
                            <SimpleItem
                                dataField="application.idSeq"
                                label={{text: "No. Pengajuan #"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                dataField="application.transactionDate"
                                label={{text: "Tanggal Pengajuan"}}
                                editorOptions={{
                                    displayFormat: 'dd MMM yyyy',
                                    type: 'datetime',
                                    readOnly: true,
                                }}
                                editorType="dxDateBox"
                            />
                            <SimpleItem
                                dataField="application.loanAmount"
                                label={{text: "Jumlah Pengajuan"}}
                                editorOptions={{
                                    readOnly: true,
                                    format: "Rp #,##0.00",
                                }}
                                editorType="dxNumberBox"
                            />
                            <SimpleItem
                                dataField="application.loanTerm"
                                label={{text: "Lama"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                dataField="application.loanStatus"
                                label={{text: "Status"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                        </GroupItem>
                    </GroupItem>
                </Form>
            </div>
            <div className={"dx-card responsive-paddings next-card"}>
                <div className="dx-form-group-with-caption mb14" style={{
                    display: "flex",
                    justifyContent: "space-between", alignItems: "center"
                }}>
                    <span className="dx-form-group-caption">Kontak</span>
                    <Button icon="textdocument"
                            type="success"
                            onClick={() => navigate(`/contact/detail?id=${detailApp.client?.id}`)}/>
                </div>
                <Form
                    colCount={1}
                    id="form2"
                    formData={detailApp}
                    showColonAfterLabel={true}
                >
                    <GroupItem colSpan={2}>
                        <GroupItem caption="" colCount={2}>
                            <SimpleItem
                                dataField="client.idSeq"
                                label={{text: "#No.Kontak"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                dataField="client.name"
                                label={{text: "Nama Lengkap"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                            <SimpleItem
                                dataField="client.phoneNumber"
                                label={{text: "No. HP"}}
                                editorOptions={{
                                    readOnly: true,
                                    mask: "+00 (X00) 000-0000",
                                    maskRules: {X: /[02-9]/},
                                }}
                            />
                            <SimpleItem
                                dataField="client.email"
                                label={{text: "Email"}}
                                editorOptions={{
                                    readOnly: true,
                                }}
                            />
                        </GroupItem>
                    </GroupItem>
                </Form>
            </div>
            <div className={"dx-card responsive-paddings form__tabs"}>
                <Form
                    colCount={1}
                    formData={detailApp}
                    showColonAfterLabel={true}
                >
                    <GroupItem caption="Detil Informasi">
                        <TabbedItem>
                            <TabPanelOptions deferRendering={false}/>
                            <Tab title="Jadwal Pembayaran">
                                <Schedule id={id}/>
                            </Tab>
                            <Tab title="Detil Pembayaran">
                                <ScheduleDetail id={id}/>
                            </Tab>
                            <Tab title="Dokumen">
                                <ContractFiles id={id}/>
                            </Tab>
                        </TabbedItem>
                    </GroupItem>
                </Form>
            </div>
        </div>
        <RestructurePopup detail={setDetail} data={detail} popupVisible={popupRestructureVisible}
                          hide={() => setPopupRestructureVisible(false)} />


        <RestructurePopupV2 detail={setDetail} data={detail} popupVisible={popupRestructureV2Visible}
                            hide={() => setPopupRestructureV2Visible(false)} />
    </>);
}
