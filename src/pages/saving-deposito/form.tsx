import { LoadIndicator, RadioGroup } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import queryString from "query-string";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bankCheckValid, getListBank } from "src/api/apploan";
import { selectBoxOptions } from "src/api/contact";
import { listProductDepositTerm } from "src/api/saving_deposit";
import { TReqSavingSubmit } from "src/api/types/ISavingDeposit";
import { initSavingForm } from "src/interfaces/ISavingDeposit";
import { notifyWarning } from "src/utils/devExtremeUtils";

const FormSavingDeposit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);

  const [formData, setFormData] = useState<TReqSavingSubmit>(initSavingForm);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isDableBankIdBankAccNumber, setDisableBankIdBankAccNumber] = useState(false);

  const listBank = selectBoxOptions(new DataSource(getListBank), "Pilih bank");
  const depositTermOptions = selectBoxOptions(
    new DataSource(listProductDepositTerm),
    "Select product deposit term"
  );

  const sendBankCheck = () => {
    const payload = {
      appId: ID,
      bankId: formData.bankId,
      bankAccountNumber: formData.bankAccountNumber
    };

    bankCheckValid(payload).then((res) => {
      setDisableBankIdBankAccNumber(res.isWaiting);
    });
  };

  const handleCheckBankAccount = (e: any) => {
    if (typeof formData.bankId === "undefined") {
      notifyWarning("belum memilih bank!!");
      e.event.preventDefault();
      return;
    }
    if (typeof formData.bankAccountNumber === "undefined") {
      notifyWarning("belum mengisi nomor rekening!!");
      e.event.preventDefault();
      return;
    }
    if (formData.bankId == null || formData.bankAccountNumber == null) {
      notifyWarning("pastikan sudah memilih bank dan mengisi nomor rekening!!");
      e.event.preventDefault();
      return;
    }

    sendBankCheck();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const onFieldDataChanged = (evt: any) => {
    const { dataField, value } = evt;

    setFormData((prev) => ({
      ...prev,
      [dataField]: value
    }));
  };

  const handleSubmit = () => {
    // setIsLoadingSubmit(true);

    console.log({ formData });

    //   submitSavingDeposit(formData)
    //     .then((res) => {
    //       console.log({ res });
    //     })
    //     .catch((err) => {
    //       notifyError(err);
    //     })
    //     .finally(() => {
    //       setIsLoadingSubmit(false);
    //     });
  };

  const RadioGroupCell = React.memo(({ data }: { data: any }) => (
    <RadioGroup
      items={[
        { label: "Yes", value: true },
        { label: "No", value: false }
      ]}
      // value={selectedValues[data.questionId]}
      layout="horizontal"
      displayExpr="label"
      valueExpr="value"
      // readOnly={disabled || loadingStates[data.questionId]}
      // onValueChanged={(e) => handleNeighbourRadioChange(data.questionId, e.value)}
    />
  ));

  return (
    <div className={"content-block"}>
      <div className={"form__tabs dx-card responsive-paddings"}>
        <Form
          colCount={1}
          id="form"
          formData={formData}
          onFieldDataChanged={onFieldDataChanged}
          labelLocation="left"
        >
          <GroupItem caption={"Simpanan Berjangka"}>
            <GroupItem colCount={1}>
              <SimpleItem
                dataField="amount"
                label={{ text: "Jumlah Simpanan" }}
                editorOptions={{
                  format: "Rp #,##0.00"
                }}
                editorType="dxNumberBox"
              />
              <SimpleItem
                dataField="termMonth"
                editorType="dxSelectBox"
                editorOptions={{ ...depositTermOptions, disabled: isDableBankIdBankAccNumber }}
                label={{ text: "Jangka Waktu" }}
              />
            </GroupItem>

            <GroupItem colCount={1}>
              <SimpleItem
                dataField="bankId"
                editorType="dxSelectBox"
                editorOptions={{ ...listBank, disabled: isDableBankIdBankAccNumber }}
                label={{ text: "Bank" }}
              />
              <GroupItem colCount={5}>
                <SimpleItem
                  colSpan={4}
                  dataField="bankAccountNumber"
                  label={{ text: "Nomor Rekening" }}
                  editorOptions={{
                    disabled: isDableBankIdBankAccNumber,
                    onKeyDown: (e: any) => {
                      const key = e.event.key;
                      e.value = String.fromCharCode(e.event.keyCode);
                      let forbiddenChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
                      if (forbiddenChars.includes(key)) e.event.preventDefault();
                      if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                        e.event.preventDefault();
                    }
                  }}
                />
                <ButtonItem horizontalAlignment={"center"} verticalAlignment={"center"}>
                  <ButtonOptions
                    type="default"
                    width={"100%"}
                    disabled={isDableBankIdBankAccNumber}
                    onClick={handleCheckBankAccount}
                  >
                    <div className="button-options">
                      <LoadIndicator
                        width="20px"
                        height="20px"
                        visible={isDableBankIdBankAccNumber}
                      />
                      <span className="dx-button-text">Periksa</span>
                    </div>
                  </ButtonOptions>
                </ButtonItem>
              </GroupItem>

              <SimpleItem
                dataField="isDeductSaving"
                editorType="dxSelectBox"
                label={{ text: "Ambil dari simpanan" }}
                render={() => <RadioGroupCell data={[]} />}
              />
              <SimpleItem
                dataField="isWithdrawOnDue"
                editorType="dxSelectBox"
                label={{ text: "Penarikan saat jatuh tempo" }}
                render={() => <RadioGroupCell data={[]} />}
              />
              <SimpleItem
                dataField="isRenewOnDue"
                editorType="dxSelectBox"
                label={{ text: "Perbarui saat jatuh tempo" }}
                render={() => <RadioGroupCell data={[]} />}
              />
            </GroupItem>
          </GroupItem>
          <GroupItem colCountByScreen={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
            <ButtonItem horizontalAlignment="left">
              <ButtonOptions width={"100%"} onClick={handleBack}>
                <span className="dx-button-text">Kembali</span>
              </ButtonOptions>
            </ButtonItem>

            <ButtonItem horizontalAlignment="left">
              <ButtonOptions
                type="default"
                width={"100%"}
                disabled={isLoadingSubmit}
                onClick={handleSubmit}
              >
                <div className="button-options">
                  <LoadIndicator width="20px" height="20px" visible={isLoadingSubmit} />
                  <span className="dx-button-text">Simpan</span>
                </div>
              </ButtonOptions>
            </ButtonItem>
          </GroupItem>
        </Form>
      </div>
    </div>
  );
};

export default FormSavingDeposit;
