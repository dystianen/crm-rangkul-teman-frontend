import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import Form, { ButtonItem, PatternRule, SimpleItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import { AsyncRule, RequiredRule, StringLengthRule } from "devextreme-react/validator";
import DataSource from "devextreme/data/data_source";
import "devextreme/data/odata/store";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router";
import { checkAccess } from "src/api/apploan";
import { selectBoxOptions, validateIdNumber } from "src/api/contact";
import {
  createSavingApplication,
  listProductApplication,
  listProductApplicationStore
} from "src/api/saving";
import { TReqSavingAppCreate } from "src/api/types/ISaving";
import { OnClickLink } from "src/components/alink";
import { ApplicationStatus } from "src/components/application-status";
import { filterOperation } from "src/constants/FilterOperation";
import { backofficeAccess } from "src/constants/variableConstata";
import { initSavingValues } from "src/interfaces/ISaving";
import { calculateFilterExpressionCustom, notifyError } from "src/utils/devExtremeUtils";
import { allowOnlyNumbers } from "src/utils/helpers";

export default function SavingApplication() {
  const navigate = useNavigate();
  const formRef = useRef<Form>(null);
  const dataGrid = useRef<DataGrid>(null);
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [savingApp, setSavingApp] = useState<TReqSavingAppCreate>(initSavingValues);
  const [isCreateSimpananVisible, setCreateSimpananVisible] = useState<boolean>(false);

  useEffect(() => {
    checkAccess(backofficeAccess.backoffice_application_saving).then((res) => {
      setCreateSimpananVisible(res);
    });
  }, []);

  const productOptions = selectBoxOptions(
    new DataSource(listProductApplication),
    "Select product deposit"
  );

  const showPopup = () => {
    const form = formRef.current!.instance;
    form.clear();
    setPopupVisible(true);
  };

  const hide = () => {
    setPopupVisible(false);
  };

  const onFieldDataChanged = (evt: any) => {
    const { dataField, value } = evt;
    // @ts-expect-error
    savingApp[dataField] = value;
  };

  const onFormSubmit = (e: any) => {
    const form = formRef.current!.instance;
    createSavingApplication(savingApp).then(
      (res) => {
        hide();
        form.clear();
        setSavingApp(initSavingValues);
        navigate(`/saving/application/form?id=${res.id}`);
      },
      (error) => {
        const { errorCode, data } = error.options;
        if (errorCode === 1020001) {
          navigate(`/contact/leads/create?ktp=${savingApp.ktp}`);
        } else {
          notifyError(data.message);
        }
      }
    );
    e.preventDefault();
  };

  const asyncValidationIdNumber = (params: any) => {
    const request = {
      phoneNumber: params.value,
      contactId: ""
    };
    return validateIdNumber(request);
  };

  const onToolbarPreparing = (e: any) => {
    const items = e.toolbarOptions.items;
    if (isCreateSimpananVisible) {
      items.push({
        location: "after",
        widget: "dxButton",
        options: {
          text: "Buat Simpanan",
          type: "default",
          stylingMode: "contained",
          onClick: showPopup
        }
      });
    }
  };

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Simpanan Berjangka</h2>
      <div className={"content-block"}>
        <div className={"dx-card"}>
          <DataGrid
            ref={dataGrid}
            dataSource={listProductApplicationStore}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={false}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
            onToolbarPreparing={onToolbarPreparing}
          >
            <Scrolling showScrollbar={"always"} />
            <FilterRow visible={true} />

            <Column
              alignment={"center"}
              dataField={"contactSeqId"}
              caption={"#Nomor Pengajuan"}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                  <OnClickLink
                    onClick={() => navigate(`/saving/application/form?id=${options.data.id}`)}
                  >
                    {options.data.contactSeqId}
                  </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
            />
            <Column
              dataField={"status"}
              caption={"Status"}
              filterOperations={filterOperation.string}
              cellRender={ApplicationStatus}
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
              dataField={"contactName"}
              caption={"Nama Anggota"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"amount"}
              caption={"Jumlah Simpanan"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"
            />
            <Column
              dataField={"contactName"}
              caption={"Nomor Virtual Account"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"destBankName"}
              caption={"Bank Pencairan"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"destBankAccountNumber"}
              caption={"No. Rekening Pencairan"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"idCardNumber"}
              caption={"Nomor KTP"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"contactPhone"}
              caption={"Nomor HP"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"creator"}
              caption={"Dibuat Oleh"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"modifier"}
              caption={"Dirubah Oleh"}
              filterOperations={filterOperation.string}
            />
            <Paging defaultPageSize={50} />
            <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
          </DataGrid>
        </div>
      </div>

      <Popup
        width={360}
        height={"auto"}
        visible={popupVisible}
        onHiding={hide}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title="Buat Simpanan"
      >
        <form onSubmit={onFormSubmit}>
          <Form
            ref={formRef}
            id="form"
            showColonAfterLabel={true}
            showValidationSummary={true}
            validationGroup="savingApplicationData"
            onFieldDataChanged={onFieldDataChanged}
          >
            <SimpleItem
              dataField="productId"
              label={{ text: "Product" }}
              editorType="dxSelectBox"
              editorOptions={productOptions}
            >
              <RequiredRule message="Product is required" />
            </SimpleItem>
            <SimpleItem
              dataField="ktp"
              label={{ text: "Nomor KTP" }}
              editorOptions={{
                min: 16,
                maxLength: 16,
                onKeyDown: (e: any) => allowOnlyNumbers(e.event)
              }}
            >
              <RequiredRule message="KTP Number is required" />
              <AsyncRule
                message="KTP Number is not registered"
                validationCallback={asyncValidationIdNumber}
              />
              <StringLengthRule min={16} message="KTP tidak kurang dar 16 karakter" />
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
    </React.Fragment>
  );
}
