import { LoadIndicator } from "devextreme-react";
import Form, {
  AsyncRule,
  ButtonItem,
  ButtonOptions,
  GroupItem,
  SimpleItem
} from "devextreme-react/form";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  contactDetailApi,
  createContactLeads,
  createLeads,
  updateLeads,
  validatePhone
} from "src/api/contact";
import { InitLeadsValue, type TReqCreateLeads } from "src/interfaces/contactDto";
import { notifyError, notifySuccess } from "src/utils/devExtremeUtils";

const CreateEditContactLeads = () => {
  const formRef = useRef<Form>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const idData = id as string;
  const isCreate = location.pathname.includes("create");
  const [leads, setLeads] = useState<TReqCreateLeads>(InitLeadsValue);
  const [isLoadingSave, setLoadingSave] = useState(false);
  const [isLoadingCreateContact, setLoadingCreateContact] = useState(false);

  useEffect(() => {
    if (idData) {
      contactDetailApi(idData).then((res: any) => {
        const data: TReqCreateLeads = {
          idNumber: res.idNumber,
          name: res.name,
          mobileNumber: res.contactPhone,
          marketAddress: res.marketAddress
        };

        setLeads(data);
      });
    }
  }, [idData]);

  const handleSuccess = () => {
    const form = formRef.current!.instance;
    form.clear();
    setLeads(InitLeadsValue);
    setLoadingSave(false);
    setLoadingCreateContact(false);
    notifySuccess("Berhasil submit data");
    navigate(-1);
  };

  const handleError = (error: any) => {
    notifyError(error.options.error);
    setLoadingSave(false);
    setLoadingCreateContact(false);
  };

  const handleSave = async () => {
    try {
      setLoadingSave(true);
      if (isCreate) {
        await createLeads(leads).then(handleSuccess).catch(handleError);
      } else {
        await updateLeads(idData, leads).then(handleSuccess).catch(handleError);
      }
    } catch (error) {
      setLoadingSave(false);
      notifyError("Gagal menyimpan data, coba lagi!");
    }
  };

  const handleCreateContact = async () => {
    try {
      setLoadingCreateContact(true);
      await createContactLeads(idData, leads).then(handleSuccess).catch(handleError);
    } catch (error) {
      setLoadingCreateContact(false);
      notifyError("Gagal menyimpan data, coba lagi!");
    }
  };

  const asyncValidationPhoneNumber = (params: any) => {
    const request = {
      phoneNumber: params.value,
      contactId: idData
    };
    return validatePhone(request);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={"content-block"}>
      <h2>{isCreate ? "Create" : "Edit"} Leads</h2>
      <form className="form__tabs" action="register">
        <Form
          ref={formRef}
          id="form"
          formData={leads}
          showColonAfterLabel={true}
          showValidationSummary={true}
          validationGroup="leadsData"
        >
          <GroupItem cssClass={"dx-card responsive-paddings next-card"}>
            <GroupItem caption="Leads Data" colCount={2}>
              <SimpleItem dataField="name" label={{ text: "Name" }} />
              <SimpleItem
                dataField="mobileNumber"
                label={{ text: "Mobile Number" }}
                editorOptions={{
                  min: 0,
                  maxLength: 15,
                  onKeyDown: (e: any) => {
                    const key = e.event.key;
                    e.value = String.fromCharCode(e.event.keyCode);
                    if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                      e.event.preventDefault();
                  }
                }}
              >
                <AsyncRule
                  message="Mobile phone is already registered"
                  validationCallback={asyncValidationPhoneNumber}
                />
              </SimpleItem>
              <SimpleItem
                dataField="idNumber"
                label={{ text: "NIK/KTP Number" }}
                editorOptions={{
                  min: 0,
                  maxLength: 20,
                  onKeyDown: (e: any) => {
                    const key = e.event.key;
                    e.value = String.fromCharCode(e.event.keyCode);
                    if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                      e.event.preventDefault();
                  }
                }}
              />
              <SimpleItem dataField="marketAddress" label={{ text: "Market Address" }} />
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
                  disabled={isLoadingSave}
                  onClick={handleSave}
                >
                  <div className="button-options">
                    <LoadIndicator width="20px" height="20px" visible={isLoadingSave} />
                    <span className="dx-button-text">Simpan</span>
                  </div>
                </ButtonOptions>
              </ButtonItem>

              <ButtonItem visible={!isCreate} colSpan={2} horizontalAlignment="left">
                <ButtonOptions
                  type="success"
                  disabled={isLoadingCreateContact}
                  onClick={handleCreateContact}
                >
                  <div className="button-options">
                    <LoadIndicator width="20px" height="20px" visible={isLoadingCreateContact} />
                    <span className="dx-button-text">Buat Kontak</span>
                  </div>
                </ButtonOptions>
              </ButtonItem>
            </GroupItem>
          </GroupItem>
        </Form>
      </form>
    </div>
  );
};

export default CreateEditContactLeads;
