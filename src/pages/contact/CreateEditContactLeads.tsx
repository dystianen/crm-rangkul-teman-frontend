import { LoadIndicator } from "devextreme-react";
import Form, {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import { AsyncRule } from "devextreme-react/validator";
import DataSource from "devextreme/data/data_source";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getActiveBranchByUserStore } from "src/api/apploan";
import {
  contactDetailApi,
  createLeads,
  selectBoxBranchOptions,
  updateLeads,
  validateIdNumber,
  validatePhone
} from "src/api/contact";
import ContactActivity from "src/components/contact/contact-activity";
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

  useEffect(() => {
    if (idData) {
      contactDetailApi(idData).then((res: any) => {
        const data: TReqCreateLeads = {
          idNumber: res.idNumber,
          name: res.name,
          mobileNumber: res.contactPhone,
          marketAddress: res.marketAddress,
          branchId: res.branchId
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
    notifySuccess("Berhasil submit data");
    navigate(-1);
  };

  const handleError = (error: any) => {
    notifyError(error.message);
    setLoadingSave(false);
  };

  const handleSave = () => {
    try {
      const form = formRef.current!.instance;
      const validate = form.validate();
      validate.status === "pending" &&
        validate.complete?.then((r) => {
          if (r.status === "invalid") return;
          setLoadingSave(true);
          if (isCreate) {
            createLeads(leads).then(handleSuccess).catch(handleError);
          } else {
            updateLeads(idData, leads).then(handleSuccess).catch(handleError);
          }
        });
    } catch (error) {
      setLoadingSave(false);
      notifyError("Gagal menyimpan data, coba lagi!");
    }
  };

  const getBranchByUser = selectBoxBranchOptions(
    new DataSource(getActiveBranchByUserStore as any),
    "Select branch"
  );

  const asyncValidationPhoneNumber = (params: any) => {
    const request = {
      phoneNumber: params.value,
      contactId: idData
    };
    return validatePhone(request);
  };

  const asyncValidationIdNumber = (params: any) => {
    const request = {
      phoneNumber: params.value,
      contactId: id
    };
    return validateIdNumber(request);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={"content-block"}>
      <h2>{isCreate ? "Create" : "Edit"} Leads</h2>
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
                maxLength: 14,
                onKeyDown: (e: any) => {
                  const key = e.event.key;
                  e.value = String.fromCharCode(e.event.keyCode);
                  if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                    e.event.preventDefault();
                }
              }}
            >
              <AsyncRule
                message="Mobile Number is already registered"
                validationCallback={asyncValidationPhoneNumber}
              />
            </SimpleItem>
            <SimpleItem
              dataField="idNumber"
              label={{ text: "No.KTP" }}
              editorOptions={{
                min: 16,
                maxLength: 16,
                onKeyDown: (e: any) => {
                  const key = e.event.key;
                  e.value = String.fromCharCode(e.event.keyCode);
                  if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                    e.event.preventDefault();
                }
              }}
            >
              <AsyncRule
                message="No.KTP is already registered"
                validationCallback={asyncValidationIdNumber}
              />
            </SimpleItem>
            <SimpleItem dataField="marketAddress" label={{ text: "Market Address" }} />
            <SimpleItem
              dataField="branchId"
              label={{ text: "Branch" }}
              editorType="dxSelectBox"
              editorOptions={getBranchByUser}
            >
              <RequiredRule message="Branch is required" />
            </SimpleItem>
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
          </GroupItem>
        </GroupItem>
      </Form>

      {!isCreate && (
        <ContactActivity contactId={id as string} withTitle />
      )}
    </div>
  );
};

export default CreateEditContactLeads;
