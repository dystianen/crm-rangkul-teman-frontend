import { DropDownButton } from "devextreme-react";
import { Button } from "devextreme-react/button";
import DataGrid, {
  Column,
  FilterRow,
  Item,
  Pager,
  Paging,
  Scrolling,
  Toolbar
} from "devextreme-react/data-grid";
import "devextreme-react/file-uploader";
import Form, { ButtonItem, PatternRule, SimpleItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import "devextreme-react/text-area";
import { AsyncRule, RequiredRule, StringLengthRule } from "devextreme-react/validator";
import DataSource from "devextreme/data/data_source";
import "devextreme/data/odata/store";
import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router";
import { contactListStore, selectBoxBranchOptions, validateIdNumber } from "src/api/contact";
import { OnClickLink } from "../../components/alink";
import { filterOperation } from "../../constants/FilterOperation";
// @ts-expect-error
import * as downloadFile from "save-file";
import { getActiveBranchByUserStore } from "../../api/apploan";
import { downloadExcel } from "../../api/http.api";

interface DataGridInstance {
  instance: {
    getVisibleColumns: () => Array<{ dataField?: string; caption?: string }>;
    getCombinedFilter: (returnString?: boolean) => unknown;
  };
}

export default function Index() {
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [contactData] = useState({
    contactIdentity: "",
    branchId: ""
  });

  const showPopup = () => {
    setPopupVisible(true);
  };

  const hide = () => {
    setPopupVisible(false);
  };

  const getBranchByUser = selectBoxBranchOptions(
    new DataSource(getActiveBranchByUserStore as any),
    "Select branch"
  );

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hide();
    navigate(`/contact/create?ktp=${contactData.contactIdentity}&branchId=${contactData.branchId}`);
  };

  const asyncValidation = (params: { value: string | number }) => {
    const request = {
      idNumber: params.value,
      contactId: ""
    };
    return validateIdNumber(request);
  };

  const onFieldDataChanged = (evt: any) => {
    // @ts-expect-error
    contactData[evt.dataField] = evt.value;
  };

  const dataGrid = useRef<DataGridInstance | null>(null);
  const onClickDownload = () => {
    const instance = dataGrid.current?.instance;

    if (!instance) {
      console.error("DataGrid instance is not available");
      return;
    }

    const fileName = "kontak.xlsx";
    const columns: string[] = [];
    const captions: string[] = [];

    const visibleColumns = instance.getVisibleColumns();
    visibleColumns.forEach((col) => {
      if (col.dataField) {
        columns.push(col.dataField);
      }
      if (col.caption) {
        captions.push(col.caption);
      }
    });

    const filter = instance.getCombinedFilter(true) || [];

    const paramSearch = {
      columns: JSON.stringify(columns),
      captions: JSON.stringify(captions),
      searchQuery: JSON.stringify(filter)
    };

    downloadExcel(`/api/contact`, paramSearch)
      .then((response) => {
        downloadFile(response, fileName);
      })
      .catch(console.error);
  };

  const actions = [
    { id: 1, name: "Add Contact", action: showPopup },
    { id: 2, name: "Add Leads", action: () => navigate("/contact/leads/create") }
  ];

  return (
    <>
      <div className={"content-block"}>
        <h2>Kontak</h2>
        <div className={"dx-card"}>
          <DataGrid
            // @ts-expect-error
            ref={dataGrid}
            dataSource={contactListStore}
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
                <DropDownButton
                  stylingMode="contained"
                  type="default"
                  text="Add New"
                  displayExpr="name"
                  items={actions}
                  onItemClick={(e) => {
                    const action = e.itemData.action;
                    action();
                  }}
                />
              </Item>
            </Toolbar>
            <Scrolling showScrollbar={"always"} />
            <FilterRow visible={true} />
            <Column
              alignment={"center"}
              dataField={"seqId"}
              caption={"#NO"}
              width={90}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                  <OnClickLink
                    onClick={() => {
                      if (options.data.contactType === "contact") {
                        navigate(`/contact/edit?id=${options.data.id}`);
                      } else {
                        navigate(`/contact/leads/edit?id=${options.data.id}`);
                      }
                    }}
                  >
                    {options.data.seqId}
                  </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
            />

            <Column
              dataField="createdOn"
              caption="Tanggal Dibuat"
              dataType="date"
              format="dd MMM yyyy HH:mm:ss"
              calculateFilterExpression={function (
                this: any,
                value: string | number | Date,
                selectedFilterOperations: any,
                target: any
              ) {
                return this.defaultCalculateFilterExpression?.(
                  new Date(value),
                  selectedFilterOperations,
                  target
                );
              }}
              filterOperations={filterOperation.date}
            />

            <Column
              dataField={"modifiedOn"}
              caption={"Tanggal Diubah"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={function (
                this: any,
                value: string | number | Date,
                selectedFilterOperations: any,
                target: any
              ) {
                return this.defaultCalculateFilterExpression?.(
                  new Date(value),
                  selectedFilterOperations,
                  target
                );
              }}
              filterOperations={filterOperation.date}
            />
            <Column
              dataField={"idNumber"}
              caption={"No.KTP"}
              width={190}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"name"}
              caption={"Nama lengkap"}
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
              dataField={"contactAddressCountry"}
              caption={"Negara"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"createdByName"}
              caption={"Dibuat oleh"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"modifiedByName"}
              caption={"Diubah oleh"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"branchName"}
              caption={"Cabang"}
              alignment={"left"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"contactType"}
              caption="Tipe Kontak"
              alignment={"left"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"statusName"}
              caption="Status"
              alignment={"left"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"marketAddress"}
              caption="Alamat Pasar"
              alignment={"left"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"uniqueIdentifier"}
              alignment={"left"}
              filterOperations={filterOperation.string}
            />
            <Paging defaultPageSize={50} />
            <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
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
        title="Input No. KTP"
      >
        <form id="form" onSubmit={onFormSubmit}>
          <Form
            showColonAfterLabel={true}
            showValidationSummary={true}
            validationGroup="OnboardingApplicationData"
            onFieldDataChanged={onFieldDataChanged}
          >
            <SimpleItem
              dataField="branchId"
              label={{ text: "Branch" }}
              editorType="dxSelectBox"
              editorOptions={getBranchByUser}
            >
              <RequiredRule message="Branch is required" />
            </SimpleItem>
            <SimpleItem
              dataField="contactIdentity"
              label={{ text: "Nomor KTP" }}
              editorOptions={{
                min: 16,
                maxLength: 16,
                onKeyDown: (e: any) => {
                  const key = e.event.key;
                  e.value = String.fromCharCode(e.event.keyCode);
                  if (
                    !/[0-9]/.test(e.value) &&
                    key !== "Control" &&
                    key !== "v" &&
                    key !== "Backspace" &&
                    key !== "Delete"
                  )
                    e.event.preventDefault();
                }
              }}
            >
              <RequiredRule message="KTP wajib diisi" />
              <AsyncRule message="No. KTP sudah terdaftar" validationCallback={asyncValidation} />
              <StringLengthRule min={16} message="KTP tidak kurang dari 16 karakter" />
              <StringLengthRule max={16} message="KTP hanya boleh 16 karakter" />
              <PatternRule message="KTP hanya angka" pattern={/^[0-9]+$/} />
            </SimpleItem>
            <ButtonItem
              horizontalAlignment="left"
              buttonOptions={{
                text: "Submit",
                type: "success",
                useSubmitBehavior: true
              }}
            />
          </Form>
        </form>
      </Popup>
    </>
  );
}
