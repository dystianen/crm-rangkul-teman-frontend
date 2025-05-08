import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import Form, { ButtonItem, PatternRule, SimpleItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import { AsyncRule, RequiredRule, StringLengthRule } from "devextreme-react/validator";
import "devextreme/data/odata/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { appCancel, checkAccess, detailAppStep } from "src/api/apploan";
import { selectBoxOptions, validateIdNumber } from "src/api/contact";
import { filterOperation } from "../../constants/FilterOperation";

import DataSource from "devextreme/data/data_source";
import ReactDOM from "react-dom/client";
import { createSavingDeposit, listProductDeposit } from "src/api/saving_deposit";
import { TReqSavingAppCreate } from "src/api/types/ISavingDeposit";
import PopupMessage from "src/components/popup-message";
import { initSavingValues } from "src/interfaces/ISavingDeposit";
import { allowOnlyNumbers } from "src/utils/helpers";
import { OnClickLink } from "../../components/alink";
import { ApplicationStatus } from "../../components/application-status";
import { backofficeAccess } from "../../constants/variableConstata";
import { useAuth } from "../../contexts/auth";
import {
  calculateFilterExpressionCustom,
  confirmNotify,
  notifyError,
  notifySuccess
} from "../../utils/devExtremeUtils";

export default function SavingDeposit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<Form>(null);
  const dataGrid = useRef<DataGrid>(null);
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [savingApp, setSavingApp] = useState<TReqSavingAppCreate>(initSavingValues);
  const [isPengajuanVisible, setPengajuanVisible] = useState<boolean>(false);
  const [isShowPopupMessage, setShowPopupMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    checkAccess(backofficeAccess.backoffice_master_contact_write).then((res) => {
      setPengajuanVisible(res);
    });
  }, []);

  const productOptions = selectBoxOptions(
    new DataSource(listProductDeposit),
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
    createSavingDeposit(savingApp).then(
      (res) => {
        hide();
        form.clear();
        setSavingApp(initSavingValues);
        navigate(`/saving/deposit/create?id=${res.id}`);
      },
      (error) => {
        notifyError(error);
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
    if (isPengajuanVisible) {
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

  const handleConfirmPopupMessage = useCallback(() => {
    navigate(url);
  }, [navigate, url]);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Pengajuan</h2>
      <div className={"content-block"}>
        <div className={"dx-card"}>
          <DataGrid
            ref={dataGrid}
            dataSource={{}}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={false}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
            onToolbarPreparing={onToolbarPreparing}
            editing={{
              allowUpdating: (options: any) => {
                let allowAccess =
                  typeof user?.userAccess !== "undefined" &&
                  user?.userAccess.some(
                    (access: string) => access === backofficeAccess.backoffice_application_canceling
                  );
                return options.row.data.statusIsActive && allowAccess;
              }
            }}
          >
            <Scrolling showScrollbar={"always"} />
            <FilterRow visible={true} />
            <Column
              alignment={"center"}
              dataField={"seqId"}
              caption={"#No"}
              width={90}
              filterOperations={filterOperation.numeric}
              cellRender={({ row }) => (
                <OnClickLink
                  onClick={() => {
                    detailAppStep(row.data.id).then((res) => {
                      const { showPopup, message, url } = res;
                      if (showPopup) {
                        setShowPopupMessage(true);
                        setPopupMessage(message);
                        setUrl(url);
                      } else {
                        navigate(url);
                      }
                    });
                  }}
                >
                  {row.data.seqId}
                </OnClickLink>
              )}
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
              dataField={"amount"}
              caption={"Jumlah Simpanan"}
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
              alignment={"center"}
              dataField={"contactIdSeq"}
              caption={"#No.Kontak"}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                  <OnClickLink
                    onClick={() => navigate(`/contact/detail?id=${options.data.contactId}`)}
                  >
                    {options.data.contactIdSeq}
                  </OnClickLink>
                );
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
              dataField={"bankName"}
              caption={"Bank"}
              alignment={"left"}
              filterOperations={filterOperation.string}
            />
            <Column
              dataField={"bankAccountNo"}
              caption={"Bank Account Number"}
              alignment={"left"}
              filterOperations={filterOperation.string}
            />
            <Column
              type={"buttons"}
              alignment={"center"}
              width={"50"}
              buttons={[
                {
                  hint: "Cancel app",
                  icon: "close",
                  name: "edit",
                  onClick: function (e: any) {
                    const key = e.row.data.id;
                    confirmNotify(
                      `Apakah yakin untuk melakukan cancel app #${e.row.data.seqId} ??`
                    ).then((result) => {
                      if (result) {
                        appCancel(key)
                          .then((resp: boolean) => {
                            notifySuccess("sukses cancel aplikasi");
                            e.component.refresh(true).done(function () {
                              e.component.cancelEditData();
                            });
                          })
                          .catch((e) => notifyError(e.message));
                      }
                    });

                    e.event.preventDefault();
                  }
                }
              ]}
            ></Column>
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
            validationGroup="savingDepositData"
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

      <PopupMessage
        visible={isShowPopupMessage}
        message={popupMessage}
        handleConfirm={handleConfirmPopupMessage}
      />
    </React.Fragment>
  );
}
