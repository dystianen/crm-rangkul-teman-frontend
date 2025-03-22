import { LoadIndicator } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getActiveBranchByUserStore } from "src/api/apploan";
import {
  contactDetailApi,
  createLeads,
  selectBoxBranchOptions,
  updateLeads
} from "src/api/contact";
import { InitLeadsValue, type TReqCreateLeads } from "src/interfaces/contactDto";
import { notifyError, notifySuccess } from "src/utils/devExtremeUtils";
import {useAuth} from "../../contexts/auth";
import ContactActivityV2 from "../../components/contact/contact-activyv2";

const CreateEditContactLeads = () => {
  const {user} = useAuth();
  const formRef = useRef<Form>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id, ktp, branchId } = queryString.parse(location.search) as {
    id?: string;
    ktp?: string;
    branchId?: string;
  };
  
  const idData = id || "";
  const idNumber = ktp || "";
  const branchID = branchId || "";
  
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

  useEffect(() => {
    if (idNumber && branchID) {
      const data: { idNumber: string, branchId: string } = {
        idNumber,
        branchId: branchID,
      };
  
      setLeads({...leads, ...data});
    }
  }, [idNumber, branchID]);

  const handleSuccess = (e: any) => {
    const form = formRef.current!.instance;
    form.clear();
    setLeads(InitLeadsValue);
    setLoadingSave(false);
    notifySuccess("Berhasil submit data");
    console.log("contact leads handleSuccess", e);
    if (typeof e.contactId !== "undefined") {
      if(e.contactId !== null) {
        navigate(`/contact/edit?id=${e.contactId}`);
      }else {
        navigate('/contact');
      }
    } else {
      navigate('/contact');
    }
  };

  const handleError = (error: any) => {
    notifyError(error.message);
    setLoadingSave(false);
  };

  const handleSave = () => {
    try {
      setLoadingSave(true);
      if (isCreate) {
        createLeads(leads).then(handleSuccess).catch(handleError);
      } else {
        updateLeads(idData, leads).then(handleSuccess).catch(handleError);
      }
    } catch (error) {
      setLoadingSave(false);
      notifyError("Gagal menyimpan data, coba lagi!");
    }
  };

  const getBranchByUser = selectBoxBranchOptions(
    new DataSource(getActiveBranchByUserStore as any),
    "Select branch"
  );

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={"content-block"}>
      <h2>Contact form</h2>
      <Form
        ref={formRef}
        id="form"
        formData={leads}
        showColonAfterLabel={true}
        showValidationSummary={true}
        validationGroup="leadsData"
      >
        <GroupItem cssClass={"dx-card responsive-paddings next-card"}>
          <GroupItem caption="Contact form" colCount={2}>
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
            />
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
            />
            <SimpleItem dataField="marketAddress" label={{ text: "Market Address" }} />
            <SimpleItem
              dataField="branchId"
              label={{ text: "Branch" }}
              editorType="dxSelectBox"
              editorOptions={getBranchByUser}
            />
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

      {!isCreate && <ContactActivityV2 user={user} contactId={id as string} withTitle />}
    </div>
  );
};

export default CreateEditContactLeads;
