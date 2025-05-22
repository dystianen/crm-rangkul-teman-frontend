import { LoadIndicator } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import DataSource from "devextreme/data/data_source";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAccess } from "src/api/apploan";
import { selectBoxOptions } from "src/api/contact";
import {
  getDetailSavingApplication,
  listProductApplicationTerm,
  submitSavingApplication
} from "src/api/saving";
import { TResSavingApplication } from "src/api/types/ISaving";
import LoadingPage from "src/components/load-panel";
import { backofficeAccess } from "src/constants/variableConstata";
import { initSavingForm } from "src/interfaces/ISaving";
import { notifyError } from "src/utils/devExtremeUtils";

const FormSavingApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = String(id);

  const [formData, setFormData] = useState<TResSavingApplication>(initSavingForm);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const isReadonly = !formData.isEditable;
  const isDraft = formData.status === "Draft";

  useEffect(() => {
    setLoadingPage(true);
    getDetailSavingApplication(ID)
      .then((res) => {
        setFormData(res);
      })
      .finally(() => {
        setLoadingPage(false);
      });
  }, [ID]);

  const savingTermOptions = selectBoxOptions(
    new DataSource(listProductApplicationTerm),
    "Select product saving term"
  );

  useEffect(() => {
    checkAccess(backofficeAccess.backoffice_application_saving).then((res) => {
      if (!res) navigate("/saving/application");
    });
  }, [navigate]);

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
    setIsLoadingSubmit(true);
    const { amount, termMonth } = formData;

    const payload = {
      id: ID,
      amount,
      termMonth
    };
    submitSavingApplication(payload)
      .then(() => {
        navigate("/saving/application");
      })
      .catch((err) => {
        const { detail } = err.options;
        notifyError(detail);
      })
      .finally(() => {
        setIsLoadingSubmit(false);
      });
  };

  return (
    <>
      <LoadingPage visible={loadingPage} />

      <div className="title-detail">
        <h2 className={"content-block"}>Pengajuan Simpanan</h2>
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
              }
            }}
          />
        </Title.Toolbar>
        <div className={"form__tabs form-container"}>
          <Form
            colCount={1}
            id="form"
            formData={formData}
            onFieldDataChanged={onFieldDataChanged}
            labelLocation="left"
          >
            <GroupItem>
              <GroupItem caption={"Detail Anggota"} cssClass="dx-card responsive-paddings">
                <GroupItem colCount={1}>
                  <SimpleItem
                    dataField="contactName"
                    label={{ text: "Nama Anggota" }}
                    editorOptions={{
                      readOnly: true
                    }}
                  />
                  <SimpleItem
                    dataField="contactPhone"
                    label={{ text: "No. HP" }}
                    editorOptions={{
                      readOnly: true,
                      mask: "+00 (X00) 000-0000",
                      maskRules: { X: /[02-9]/ }
                    }}
                  />
                  <SimpleItem
                    dataField="idCardNumber"
                    editorType="dxTextBox"
                    label={{ text: "Nomor KTP" }}
                    editorOptions={{
                      readOnly: true
                    }}
                  />
                </GroupItem>
              </GroupItem>

              <GroupItem
                caption={"Detail Simpanan"}
                colCount={1}
                cssClass="dx-card responsive-paddings next-card"
              >
                <SimpleItem
                  dataField="seqId"
                  label={{ text: "#Nomor Pengajuan" }}
                  visible={!isDraft}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="status"
                  label={{ text: "Status Pengajuan" }}
                  visible={!isDraft}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="createdOn"
                  editorType="dxDateBox"
                  label={{ text: "Tanggal Pengajuan" }}
                  visible={!isDraft}
                  editorOptions={{
                    displayFormat: "dd MMM yyyy",
                    type: "datetime",
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="contactVa"
                  label={{ text: "Nomor Virtual Account" }}
                  visible={!isDraft}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="amount"
                  label={{ text: "Jumlah Simpanan" }}
                  editorOptions={{
                    format: "Rp #,##0.00",
                    readOnly: isReadonly
                  }}
                  editorType="dxNumberBox"
                />
                <SimpleItem
                  dataField="termMonth"
                  editorType="dxSelectBox"
                  editorOptions={{ ...savingTermOptions, readOnly: isReadonly }}
                  label={{ text: "Jangka Waktu" }}
                />
              </GroupItem>

              <GroupItem
                caption={"Pencairan Simpanan"}
                colCount={1}
                cssClass="dx-card responsive-paddings next-card"
              >
                <SimpleItem
                  dataField="bankName"
                  label={{ text: "Bank" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
                <SimpleItem
                  dataField="bankAccountNumber"
                  label={{ text: "Nomor Rekening" }}
                  editorOptions={{
                    readOnly: true
                  }}
                />
              </GroupItem>
            </GroupItem>
            <GroupItem visible={!isReadonly} colCountByScreen={{ xs: 4, sm: 8, md: 10, lg: 8 }}>
              <ButtonItem horizontalAlignment="left">
                <ButtonOptions width={"100%"} onClick={handleBack}>
                  <span className="dx-button-text">Batal</span>
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
    </>
  );
};

export default FormSavingApplication;
