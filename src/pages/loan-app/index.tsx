import React, {useRef, useState} from "react";
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

import Form, {
    ButtonItem,
    PatternRule,
    SimpleItem,
} from "devextreme-react/form";
import {selectBoxBranchOptions, selectBoxOptions, validateIdNumber} from "src/api/contact";
import {Button} from "devextreme-react/button";
import {useNavigate} from "react-router";
import {filterOperation} from "../../constants/FilterOperation";
import {Popup} from "devextreme-react/popup";
import {RequiredRule, AsyncRule, StringLengthRule} from "devextreme-react/validator";
import DataSource from "devextreme/data/data_source";
import {
    appLoanListStore,
    createAppLoanOnboarding, getActiveBranchByUserStore, getActiveProductByBranch,
    getActiveProductStore,
} from "src/api/apploan";

import {
    AppLoanOnboardingRequest,
    initLoanOnboardingValue,
} from "src/interfaces/appLoanOnboarding";
import notify from "devextreme/ui/notify";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../components/alink";
import {ApplicationStatus} from "../../components/application-status";
import {downloadExcel} from "../../api/http.api";
// @ts-ignore
import * as downloadFile from "save-file";

export default function Index() {
    const navigate = useNavigate();
    const formRef = useRef<Form>(null);
    const [popupVisible, setPopupVisible] = React.useState(false);
    const [productOptions, setProductOptions] = useState<any>(undefined);
    const [productComboOptions, setComboProductOptions] = useState<any>({});
    const [loanAppOnboarding, setLoanAppOnboarding] =
        useState<AppLoanOnboardingRequest>(initLoanOnboardingValue);

    const getBranchByUser = selectBoxBranchOptions(
        new DataSource(getActiveBranchByUserStore as any),
    "Select branch");

    const getProductList = selectBoxOptions(
        new DataSource(getActiveProductStore as any),
        "Select product"
    );

    const showPopup = (evt: any) => {
        const form = formRef.current!.instance;
        form.resetValues();
        setPopupVisible(true);
    };

    const hide = () => {
        setPopupVisible(false);
    };

    const onFieldDataChanged = (evt: any) => {
        if (evt.dataField === "branchId" && evt.value != null) {
            setComboProductOptions(selectBoxOptions(
                new DataSource(getActiveProductByBranch(evt.value)),
                "Select product"
            ));
        }

        if (evt.dataField === "productId" && evt.value != null) {
            setProductOptions(evt.value);
        }
        loanAppOnboarding[evt.dataField] = evt.value;
    };

    const onFormSubmit = (e: any) => {
        hide();
        const form = formRef.current!.instance;
        const request = loanAppOnboarding;

        createAppLoanOnboarding(request).then(
            (res) => {
                if (res) {
                    setLoanAppOnboarding(initLoanOnboardingValue);
                    form.resetValues();
                    navigate(`/loan-app/create/step/1/?id=${res.appId}`);
                }
            }, (error) => {
                const {status} = error.options;
                if (status == "20101") {
                    navigate(`/contact/create?ktp=${request.contactIdentity}&branchId=${request.branchId}&productId=${request.productId}&backTo=step1`);
                } else {
                    notify({
                        message: error,
                        position: {
                            my: "center top",
                            at: "center top",
                        },
                    }, "error", 3000);
                }
            }
        );
        e.preventDefault();
    };

    const asyncValidationIdNumber = (params: any) => {
        const request = {
            phoneNumber: params.value,
            contactId: "",
        };
        return validateIdNumber(request);
    };

    const dataGrid = useRef<any>();
    const onClickDownload = (e: any) => {
        let instance: any = dataGrid.current?.instance;
        let fileName = `pengajuan.xlsx`;
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
        downloadExcel(`/api/trx/application`, paramSearch)
            .then((response) => {
                downloadFile(response, fileName);
            })
            .catch(console.error);
        console.log(paramSearch);
    }

    return (<React.Fragment>
        <h2 className={"content-block"}>Pengajuan</h2>
        <div className={"content-block"}>
            <div className={"dx-card"}>
                <DataGrid
                    ref={dataGrid}
                    dataSource={appLoanListStore}
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
                        <Item location="after">
                            <Button
                                text="Pengajuan Baru"
                                type="default"
                                stylingMode="contained"
                                onClick={showPopup}
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
                                onClick={() => navigate(`/loan-app/detail?id=${options.data.id}`)}>{options.data.seqId}</OnClickLink>);
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
                        cellRender={ApplicationStatus}
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
                        filterOperations={filterOperation.string}
                    />
                    <Column
                        dataField={"contactIdNumber"}
                        caption={"No. KTP"}
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

        <Popup
            width={360}
            height={320}
            visible={popupVisible}
            onHiding={hide}
            hideOnOutsideClick={true}
            showCloseButton={true}
            title="Aplikasi baru"
        >
            <form onSubmit={onFormSubmit}>
                <Form
                    ref={formRef}
                    id="form"
                    showColonAfterLabel={true}
                    showValidationSummary={true}
                    validationGroup="OnboardingApplicationData"
                    onFieldDataChanged={onFieldDataChanged}
                >
                    <SimpleItem
                        dataField="branchId"
                        label={{text: "Branch"}}
                        editorType="dxSelectBox"
                        editorOptions={getBranchByUser}
                    >
                        <RequiredRule message="Branch is required"/>
                    </SimpleItem>
                    <SimpleItem
                        dataField="productId"
                        label={{text: "Product"}}
                        editorType="dxSelectBox"
                        editorOptions={productComboOptions}
                    >
                        <RequiredRule message="Product is required"/>
                    </SimpleItem>
                    <SimpleItem
                        dataField="contactIdentity"
                        label={{text: "Nomor KTP"}}
                        editorOptions={{
                            min: 16,
                            maxLength: 16,
                            onKeyDown: (e: any) => {
                                const key = e.event.key;
                                e.value = String.fromCharCode(e.event.keyCode);
                                if (
                                    !/[0-9]/.test(e.value) &&
                                    key !== "Control" && key !== "v" &&
                                    key !== "Backspace" &&
                                    key !== "Delete"
                                )
                                    e.event.preventDefault();
                            },
                        }}
                    >
                        <RequiredRule message="KTP Number is required"/>
                        <AsyncRule
                            message="KTP Number is not registered"
                            validationCallback={asyncValidationIdNumber}
                        />
                        <StringLengthRule
                            min={16}
                            message="KTP tidak kurang dar 16 karakter"
                        />
                        <PatternRule
                            message="KTP hanya angka"
                            pattern={/^[0-9]+$/}
                        />
                    </SimpleItem>
                    <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={{
                            text: "Submit",
                            type: "success",
                            useSubmitBehavior: true,
                        }}
                    />
                </Form>
            </form>
        </Popup>
    </React.Fragment>);
}
