import DataGrid, { Column, FilterRow, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import Form, { ButtonItem, PatternRule, SimpleItem } from "devextreme-react/form";
import { Popup } from "devextreme-react/popup";
import { AsyncRule, RequiredRule, StringLengthRule } from "devextreme-react/validator";
import DataSource from "devextreme/data/data_source";
import "devextreme/data/odata/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  appCancel,
  appLoanListStore,
  checkAccess,
  createAppLoanOnboarding,
  detailAppStep,
  getActiveBranchByUserStore,
  getActiveProductByBranch,
  getQuickFilterListStore
} from "src/api/apploan";
import { selectBoxBranchOptions, selectBoxOptions, validateIdNumber } from "src/api/contact";
import { filterOperation } from "../../constants/FilterOperation";

import { SelectBox, SelectBoxTypes } from "devextreme-react/select-box";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import notify from "devextreme/ui/notify";
import ReactDOM from "react-dom/client";
import * as downloadFile from "save-file";
import PopupMessage from "src/components/popup-message";
import {
  AppLoanOnboardingRequest,
  initLoanOnboardingValue
} from "src/interfaces/appLoanOnboarding";
import { allowOnlyNumbers } from "src/utils/helpers";
import { downloadExcel } from "../../api/http.api";
import { OnClickLink } from "../../components/alink";
import { ApplicationStatus } from "../../components/application-status";
import { backofficeAccess } from "../../constants/variableConstata";
import { useAuth } from "../../contexts/auth";
import { confirmNotify, notifyError, notifySuccess } from "../../utils/devExtremeUtils";
import "./loan-app.scss";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<Form>(null);
  const dataGrid = useRef<DataGrid>(null);
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [productComboOptions, setComboProductOptions] = useState<any>({});
  const [loanAppOnboarding, setLoanAppOnboarding] =
    useState<AppLoanOnboardingRequest>(initLoanOnboardingValue);
  const [isPengajuanVisible, setPengajuanVisible] = useState<boolean>(false);

  const [quickFilter, setQuickFilter] = useState<string | undefined>(undefined);
  const [isShowPopupMessage, setShowPopupMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    checkAccess(backofficeAccess.backoffice_master_contact_write).then((res) => {
      setPengajuanVisible(res);
    });
  }, []);

  const getBranchByUser = selectBoxBranchOptions(
    new DataSource(getActiveBranchByUserStore as any),
    "Select branch"
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
      setComboProductOptions(
        selectBoxOptions(new DataSource(getActiveProductByBranch(evt.value)), "Select product")
      );
    }

    // @ts-expect-error
    loanAppOnboarding[evt.dataField] = evt.value;
  };

  const onFormSubmit = (e: any) => {
    hide();
    const form = formRef.current!.instance;
    const request = loanAppOnboarding;

    createAppLoanOnboarding(request).then(
      (res) => {
        if (res) {
          console.log("app create ", res);
          if (res.isEkyc) {
            setLoanAppOnboarding(initLoanOnboardingValue);
            form.resetValues();
            navigate(`/loan-app/create/step/1/?id=${res.appId}&autoNext=false`);
          } else {
            navigate(
              `/contact/edit?id=${res.contactId}&ktp=${request.contactIdentity}&branchId=${request.branchId}&productId=${request.productId}&backTo=step1`
            );
          }
        }
      },
      (error) => {
        const { status } = error.options;
        if (status === "20101") {
          navigate(
            `/contact/leads/create?ktp=${request.contactIdentity}&branchId=${request.branchId}`
          );
        } else {
          notify(
            {
              message: error,
              position: {
                my: "center top",
                at: "center top"
              }
            },
            "error",
            3000
          );
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
      searchQuery: JSON.stringify(filter)
    };
    downloadExcel(`/api/trx/application`, paramSearch)
      .then((response) => {
        downloadFile(response, fileName);
      })
      .catch(console.error);
    console.log(paramSearch);
  };

  const onValueQuickFilterChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setQuickFilter(e.value);
    e.event && e.event.preventDefault();
  }, []);

  const onToolbarPreparing = (e: any, visible: boolean) => {
    console.log("onToolbarPreparing", e);
    const items = e.toolbarOptions.items;
    items.unshift({
      location: "before",
      template: (itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => {
        const dom = ReactDOM.createRoot(itemElement);
        dom.render(
          <>
            <div className="dx-field dx-search-app">
              <div className="dx-field-label">List of QF </div>
              <div className="dx-field-value w160">
                <SelectBox
                  dataSource={new DataSource(getQuickFilterListStore)}
                  valueExpr={"id"}
                  displayExpr={"name"}
                  placeholder={" "}
                  onValueChanged={onValueQuickFilterChanged}
                  showClearButton={true}
                  value={quickFilter}
                />
              </div>
            </div>
          </>
        );
      }
    });
    items.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        text: "Download",
        type: "success",
        stylingMode: "contained",
        onClick: onClickDownload
      }
    });
    if (isPengajuanVisible) {
      items.push({
        location: "after",
        widget: "dxButton",
        options: {
          text: "Pengajuan Baru",
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
            dataSource={appLoanListStore(quickFilter)}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={false}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
            onToolbarPreparing={(e) => onToolbarPreparing(e, isPengajuanVisible)}
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
              cellTemplate={function (container: any, options: any) {
                const id = String(options.data.id);
                const dom = ReactDOM.createRoot(container);
                dom.render(
                  <OnClickLink
                    onClick={() => {
                      detailAppStep(id).then((res) => {
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
                    {options.data.seqId}
                  </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
            />
            <Column
              dataField={"createdOn"}
              caption={"Tanggal Dibuat"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={(
                value: any,
                selectedFilterOperations: any,
                target: any
              ) => {
                // @ts-ignore
                const column = this as any;
                return column.defaultCalculateFilterExpression.apply(column, [
                  new Date(value),
                  selectedFilterOperations,
                  target
                ]);
              }}
              filterOperations={filterOperation.date}
            />
            <Column
              dataField={"modifiedOn"}
              caption={"Tanggal Diubah"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={(
                value: any,
                selectedFilterOperations: any,
                target: any
              ) => {
                // @ts-ignore
                const column = this as any;
                return column.defaultCalculateFilterExpression.apply(column, [
                  new Date(value),
                  selectedFilterOperations,
                  target
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
            <Column
              dataField={"note"}
              caption={"Keterangan"}
              width={200}
              cssClass={"wrappedColumnClass"}
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
              label={{ text: "Branch" }}
              editorType="dxSelectBox"
              editorOptions={getBranchByUser}
            >
              <RequiredRule message="Branch is required" />
            </SimpleItem>
            <SimpleItem
              dataField="productId"
              label={{ text: "Product" }}
              editorType="dxSelectBox"
              editorOptions={productComboOptions}
            >
              <RequiredRule message="Product is required" />
            </SimpleItem>
            <SimpleItem
              dataField="contactIdentity"
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
