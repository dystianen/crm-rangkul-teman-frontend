import React, {useRef, useState} from 'react';
import 'devextreme/data/odata/store';
import DataGrid, {
    Column,
    Pager,
    Paging,
    FilterRow,
    Toolbar,
    Scrolling,
    Item
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import 'devextreme-react/file-uploader';
import {
    contactListStore, selectBoxBranchOptions, validateIdNumber,
} from "src/api/contact";
import {Button} from 'devextreme-react/button';
import {useNavigate} from "react-router";
import {filterOperation} from "../../constants/FilterOperation";
import {Popup} from 'devextreme-react/popup';
import {useDispatch} from "react-redux";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../components/alink";

import Form, {
    ButtonItem,
    PatternRule,
    SimpleItem,
} from "devextreme-react/form";
import {RequiredRule, AsyncRule, StringLengthRule} from "devextreme-react/validator";
import {downloadExcel} from "../../api/http.api";
import * as downloadFile from "save-file";
import DataSource from "devextreme/data/data_source";
import {getActiveBranchByUserStore} from "../../api/apploan";

export default function Index() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [popupVisible, setPopupVisible] = React.useState(false);
    const [idNumber, setIdNumber] = useState("");
    const [contactData] = useState({});
    const showPopup = (evt: any) => {
        setPopupVisible(true);
    }

    const hide = () => {
        setPopupVisible(false);
    }

    const branchByUser = React.useRef();
    const getBranchByUser = selectBoxBranchOptions(
        new DataSource(getActiveBranchByUserStore as any)
        , "Select branch");

    const onFormSubmit = (e: any) => {
        hide();
        navigate(`/contact/create?ktp=${contactData?.contactIdentity}&branchId=${contactData.branchId}`);
        e.preventDefault();
    }

    const asyncValidation = (params: any) => {
        setIdNumber(params.value)
        const request = {
            idNumber: params.value,
            contactId: "",
        };
        return validateIdNumber(request);
    }

    const onFieldDataChanged = (evt: any) => {
        contactData[evt.dataField] = evt.value;
    };

    const dataGrid = useRef();
    const onClickDownload = (e: any) => {
        let instance = dataGrid.current?.instance;
        let fileName = 'kontak.xlsx';
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
        downloadExcel(`/api/contact`, paramSearch)
            .then((response) => {
                downloadFile(response, fileName);
            })
            .catch(console.error);
        console.log(paramSearch);
    }

    return (
        <React.Fragment>
            <h2 className={'content-block'}>Kontak</h2>
            <div className={'content-block'}>
                <div className={'dx-card'}>
                    <DataGrid
                        ref={dataGrid}
                        dataSource={contactListStore}
                        focusedRowEnabled={true}
                        remoteOperations={true}
                        columnAutoWidth={true}
                        wordWrapEnabled={false}
                        showBorders={true}
                        dateSerializationFormat={'yyyy-MM-ddTHH:mm:ss.SSSxxx'}
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
                                    text="Tambah baru"
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
                            dataField={'seqId'}
                            caption={'#NO'} width={90}
                            cellTemplate={function (container: any, options: any) {
                                const dom = ReactDOM.createRoot(container);
                                dom.render(<OnClickLink
                                    onClick={() => navigate(`/contact/edit?id=${options.data.id}`)}>{options.data.seqId}</OnClickLink>);
                            }}
                            filterOperations={filterOperation.numeric}
                        />

                        <Column
                            dataField={'createdOn'}
                            caption={'Tanggal Dibuat'}
                            dataType={'date'}
                            format={'dd MMM yyyy HH:mm:ss'}
                            calculateFilterExpression={function (
                                value: any,
                                selectedFilterOperations: any,
                                target: any,
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
                            dataField={'modifiedOn'}
                            caption={'Tanggal Diubah'}
                            dataType={'date'}
                            format={'dd MMM yyyy HH:mm:ss'}
                            calculateFilterExpression={function (
                                value: any,
                                selectedFilterOperations: any,
                                target: any,
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
                            dataField={'idNumber'}
                            caption={'No.KTP'}
                            width={190}
                            filterOperations={filterOperation.string}
                        />
                        <Column
                            dataField={'name'}
                            caption={'Nama lengkap'}
                            width={190}
                            filterOperations={filterOperation.string}
                        />
                        <Column
                            dataField={'contactPhone'}
                            caption={'No. HP'}
                            filterOperations={filterOperation.string}
                        />
                        <Column
                            dataField={'contactEmail'}
                            caption={'Email'}
                            filterOperations={filterOperation.string}
                        />
                        <Column
                            dataField={'contactAddressCountry'}
                            caption={'Negara'}
                            filterOperations={filterOperation.string}
                        />
                        <Column
                            dataField={'createdByName'}
                            caption={'Dibuat oleh'}
                            filterOperations={filterOperation.string}
                        />
                        <Column
                            dataField={'modifiedByName'}
                            caption={'Diubah oleh'}
                            filterOperations={filterOperation.string}
                        />
                        <Column
                            dataField={"branchName"}
                            caption={"Cabang"}
                            alignment={"left"}
                            filterOperations={filterOperation.string}
                        />
                        <Paging defaultPageSize={50}/>
                        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]}/>
                    </DataGrid>
                </div>
            </div>
            <Popup
                width={360}
                height={280}
                visible={popupVisible}
                onHiding={hide}
                hideOnOutsideClick={true}
                showCloseButton={true}
                title="Input No. KTP">
                <form action="validate" onSubmit={onFormSubmit}>
                    <Form
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
                            <RequiredRule message="KTP wajib diisi"/>
                            <AsyncRule
                                message="No. KTP sudah terdaftar"
                                validationCallback={asyncValidation}
                            />
                            <StringLengthRule
                                min={16}
                                message="KTP tidak kurang dari 16 karakter"
                            />
                            <StringLengthRule
                                max={16}
                                message="KTP hanya boleh 16 karakter"
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
        </React.Fragment>
    );
}
