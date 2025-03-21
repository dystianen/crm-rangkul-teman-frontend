import { LoadIndicator, Popup } from "devextreme-react";
import Form, {
  ButtonItem,
  ButtonOptions,
  GroupItem,
  Item,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import { ClickEvent } from "devextreme/ui/button";
import { useCallback, useEffect, useState } from "react";
import {
  activityCategoryStore, activityResultByTypeStore,
  activityResultStore, activityTypeByCategoryStore, activityTypeFieldForm,
  activityTypeStore,
  purposeCallStore,
  purposeVisitStore,
  salesOfferingStore,
  selectBoxOptions
} from "src/api/contact";
import { ajaxPatch, ajaxPost } from "src/api/http.api";
import useUserRole from "src/utils/configUserRole.util";
import { convertToUTCString } from "src/utils/dateUtils";
import { notifyError } from "src/utils/devExtremeUtils";
import imageCompress from "src/utils/imageCompress.util";
import GoogleMapsLocation from "../google-maps-location/GoogleMapsLocation";
import "./activity-form.scss";
import {contactActivityFieldForm} from "../../constants/variableConstata";

export interface IContactActivity {
  contactId?: string;
  id?: string;
  comment?: string;
  categoryId?: string;
  resultId?: string;
  typeId?: string;
  currentGeoposition?: boolean;
  ptpAmount?: string;
  ptpDate?: string;
  photo?: string;
  image?: string;
  purposeVisitId?: string;
  purposeCallId?: string;
  latitude?: string;
  longitude?: string;
  salesOfferingId?: string;
}

interface ActivityContactProps {
  activityContactData: IContactActivity;
  isModalVisible: boolean;
  onSubmit: (e: any) => void;
  onCloseModal: (e: any) => void;
}

const defaultCenter = {
  lat: -6.2262903,
  lng: 106.8325905
};

const isBase64 = (str: string) => {
  return /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(str);
};

interface FieldAvailable{
  visible: boolean;
  isRequired: boolean;
  displayOrder: number;
}

interface FieldForm {
  comment: FieldAvailable;
  categoryId: FieldAvailable;
  resultId: FieldAvailable;
  typeId: FieldAvailable;
  currentGeoposition: FieldAvailable;
  ptpAmount: FieldAvailable;
  ptpDate: FieldAvailable;
  photo: FieldAvailable;
  image: FieldAvailable;
  purposeVisitId: FieldAvailable;
  purposeCallId: FieldAvailable;
  latitude: FieldAvailable;
  longitude: FieldAvailable;
  salesOfferingId: FieldAvailable;
}

export default function ActivityContactForm(props: ActivityContactProps) {
  const [loading, setLoading] = useState(false);
  const [resultDataOption, setResultDataOption] = useState<any>({});
  const [activityContactData, setActivityContactData] = useState<IContactActivity>(
    props.activityContactData
  );
  const [typeOptions, setTypeOptions] = useState<any>({});

  const [center, setCenter] = useState(defaultCenter);
  const [geoposition, setGeoposition] = useState({
    isStreetShop: false,
    latitude: "",
    longitude: ""
  });
  const [image, setImage] = useState("");

  useEffect(() => {
    const data = props.activityContactData;
    if (data.image) {
      setImage(data.image);
    }
    if (data.latitude && data.longitude) {
      setGeoposition({
        isStreetShop: true,
        latitude: data.latitude,
        longitude: data.longitude
      });
    }
  }, [props.activityContactData]);

  const resetFieldForm: FieldForm = {
      comment: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      categoryId: {
          visible: true,
          isRequired: true,
          displayOrder: 0,
      },
      resultId: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      typeId: {
          visible: true,
          isRequired: true,
          displayOrder: 0,
      },
      currentGeoposition: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      ptpAmount: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      ptpDate: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      photo: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      image: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      purposeVisitId: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      purposeCallId: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      latitude: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      longitude: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
      salesOfferingId: {
          visible: false,
          isRequired: false,
          displayOrder: 0,
      },
  };

  const [fieldForm, setFieldForm] = useState<FieldForm>(resetFieldForm);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setLoading(true);

      const updatedData = { ...activityContactData };
      delete updatedData.currentGeoposition;

      const payload: any = {
        ...updatedData,
        photo: image,
        latitude: geoposition.latitude,
        longitude: geoposition.longitude,
        ptpAmount: updatedData.ptpAmount ? Number(updatedData.ptpAmount) : null,
        ptpDate: updatedData.ptpDate ? convertToUTCString(new Date(updatedData.ptpDate)) : null
      };

      if (image === updatedData.image || !isBase64(image)) {
        delete payload.photo;
      }

      delete payload.image;

      if (updatedData.id) {
        await ajaxPatch(`/api/contact/activity/update/${updatedData.id}`, payload).then(
            ()=>setFieldForm(resetFieldForm));
      } else {
        await ajaxPost("/api/contact/activity/create", payload).then(
            ()=>setFieldForm(resetFieldForm));
      }

      setLoading(false);
      resetGeoposition();
      setImage("");
      props.onSubmit(event);
    } catch (err) {
      notifyError(err as string);
      setLoading(false);
    }
  };

  const categoryOptions = selectBoxOptions(new DataSource(activityCategoryStore), "Select Activity Category");

  const salesOfferingOptions = selectBoxOptions(
    new DataSource(salesOfferingStore),
    "Select Sales Offering"
  );
  const purposeVisitOptions = selectBoxOptions(
    new DataSource(purposeVisitStore),
    "Select Purpose Visit"
  );
  const purposeCallOptions = selectBoxOptions(
    new DataSource(purposeCallStore),
    "Select Purpose Visit"
  );

  const resetGeoposition = () => {
    setGeoposition({ isStreetShop: false, latitude: "", longitude: "" });
  };
  
  const onFieldAppDataChanged = useCallback((evt: any) => {
    // Street Shop
    if (evt.dataField === "currentGeoposition" && evt.value != null) {
      const checked = evt.value;
      if (checked && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setGeoposition((prev) => {
            const lat = position.coords.latitude.toString();
            const lng = position.coords.longitude.toString();
            return prev.latitude !== lat || prev.longitude !== lng
              ? { isStreetShop: true, latitude: lat, longitude: lng }
              : prev;
          });

          setCenter((prev) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            return prev.lat !== lat || prev.lng !== lng ? { lat, lng } : prev;
          });
        });
      } else {
        resetGeoposition();
      }
      return;
    }

    if (evt.dataField === "resultId" && evt.value !== null) {
      setActivityContactData((prev) => ({
        ...prev,
        resultId: evt.value
      }));
    }

    // Menghindari rendering ulang yg menyebabkan scroll ke atas
    activityContactData[evt.dataField] = evt.value;
  }, []);

  useEffect(() => {
    setActivityContactData((prevContact) => ({ ...prevContact, ...props.activityContactData }));
    if (typeof props.activityContactData.typeId !== "undefined") {
      setResultDataOption(
        selectBoxOptions(
          new DataSource(activityResultStore(props.activityContactData.typeId)),
          "Select Result"
        )
      );
    }
  }, [props.activityContactData]);

  const onFileChanged = useCallback(async (e: any) => {
    if (e.value.length > 0) {
      const uri = await imageCompress(e.value[0]);
      setImage(uri.base64);
    }
  }, []);

  const uploadPhotoOptions = {
    selectButtonText: "Select photo",
    accept: "image/*",
    uploadMode: "useForm",
    onValueChanged: onFileChanged
  };

  const handleCloseModal = (e: ClickEvent) => {
    resetGeoposition();
    setActivityContactData(props.activityContactData);
    setFieldForm(resetFieldForm);
    props.onCloseModal(e);
  };

  
  const onChangeCategory = (e:any) => {
    console.log("onChangeCategory", e);
    if(e.value != null && e.value.length > 0){
      const selectOptions = selectBoxOptions(new DataSource(activityTypeByCategoryStore(e.value)), "Select Activity Type");
      setTypeOptions(selectOptions);
    }
    setFieldForm(resetFieldForm);
  }
  
  const onChangeType = (e:any) => {
    console.log("onChangeType", e);
    if(e.value != null && e.value.length > 0) {
      setResultDataOption(
          selectBoxOptions(new DataSource(activityResultByTypeStore(e.value)), "Select Result")
      );
      
      activityTypeFieldForm(e.value).then((rs)=> {
        let newFieldForm = fieldForm;
        
        let result = rs.find((f:any)=>f.field===contactActivityFieldForm.RESULT);
        newFieldForm["resultId"] = {
          visible: (typeof result !== "undefined"), displayOrder: (typeof result !== "undefined") && result.displayOrder, isRequired: (typeof result !== "undefined") && result.isRequired
        };
        
        let photo = rs.find((f:any)=>f.field===contactActivityFieldForm.PHOTO);
        newFieldForm["photo"] = {
          visible: (typeof photo !== "undefined"), displayOrder: (typeof photo !== "undefined") && photo.displayOrder, isRequired: (typeof photo !== "undefined") && photo.isRequired
        };
        
        let currentPosition = rs.find((f:any)=>f.field===contactActivityFieldForm.CURRENT_GEO_POSITION);
        newFieldForm["currentGeoposition"] = {
          visible: (typeof currentPosition !== "undefined"), displayOrder: (typeof currentPosition !== "undefined") && currentPosition.displayOrder, isRequired: (typeof currentPosition !== "undefined") && currentPosition.isRequired
        };
        
        let comment = rs.find((f:any)=>f.field===contactActivityFieldForm.COMMENT);
        newFieldForm["comment"] = {
          visible: (typeof comment !== "undefined"), displayOrder: (typeof comment !== "undefined") && comment.displayOrder, isRequired: (typeof comment !== "undefined") && comment.isRequired
        };
        
        let ptpDate = rs.find((f:any)=>f.field===contactActivityFieldForm.PTP_DATE);
        newFieldForm["ptpDate"] = {
          visible: (typeof ptpDate !== "undefined"), displayOrder: (typeof ptpDate !== "undefined") && ptpDate.displayOrder, isRequired: (typeof ptpDate !== "undefined") && ptpDate.isRequired
        };
        let ptpAmount = rs.find((f:any)=>f.field===contactActivityFieldForm.PTP_AMOUNT);
        newFieldForm["ptpAmount"] = {
          visible: (typeof ptpAmount !== "undefined"), displayOrder: (typeof ptpAmount !== "undefined") && ptpAmount.displayOrder, isRequired: (typeof ptpAmount !== "undefined") && ptpAmount.isRequired
        };
        let purposeVisitId = rs.find((f:any)=>f.field===contactActivityFieldForm.PURPOSE_OF_VISIT);
        newFieldForm["purposeVisitId"] = {
          visible: (typeof purposeVisitId !== "undefined"), displayOrder: (typeof purposeVisitId !== "undefined") && purposeVisitId.displayOrder, isRequired: (typeof purposeVisitId !== "undefined") && purposeVisitId.isRequired
        };
        let purposeCallId = rs.find((f:any)=>f.field===contactActivityFieldForm.PURPOSE_OF_CALL);
        newFieldForm["purposeCallId"] = {
          visible: (typeof purposeCallId !== "undefined"), displayOrder: (typeof purposeCallId !== "undefined") && purposeCallId.displayOrder, isRequired: (typeof purposeCallId !== "undefined") && purposeCallId.isRequired
        };
        let salesOfferingId = rs.find((f:any)=>f.field===contactActivityFieldForm.SALES_OFFERING);
        newFieldForm["salesOfferingId"] = {
          visible: (typeof salesOfferingId !== "undefined"), displayOrder: (typeof salesOfferingId !== "undefined") && salesOfferingId.displayOrder, isRequired: (typeof salesOfferingId !== "undefined") && salesOfferingId.isRequired
        };
        setFieldForm(newFieldForm);
        console.log("field form: ",newFieldForm);
      });
    }
  }
  

  return (
    <Popup
      visible={props.isModalVisible}
      title="Activity Form"
      width={window.innerWidth <= 600 ? "auto" : 500}
      height={"auto"}
      maxHeight={700}
      fullScreen={window.innerWidth <= 600}
    >
      <form onSubmit={onSubmit}>
        <Form
          id="form"
          showColonAfterLabel={true}
          showValidationSummary={true}
          validationGroup="OnActivityContactData"
          formData={activityContactData}
          disabled={loading}
          onFieldDataChanged={onFieldAppDataChanged}
        >
          <SimpleItem
              dataField="categoryId"
              label={{ text: "Activity Category" }}
              editorType="dxSelectBox"
              visible={fieldForm.categoryId.visible}
              isRequired={fieldForm.categoryId.isRequired}
              editorOptions={{...categoryOptions,
                onValueChanged: onChangeCategory
                
          }}
          >
            <RequiredRule message="Type is required" />
          </SimpleItem>
          <SimpleItem
            dataField="typeId"
            label={{ text: "Activity Type" }}
            editorType="dxSelectBox"
            visible={fieldForm.typeId.visible}
            isRequired={fieldForm.typeId.isRequired}
            editorOptions={{...typeOptions, onValueChanged: onChangeType}}
          >
            <RequiredRule message="Type is required" />
          </SimpleItem>
          <SimpleItem
            dataField="resultId"
            label={{ text: "Result" }}
            editorType="dxSelectBox"
            visible={fieldForm.resultId.visible}
            isRequired={fieldForm.resultId.isRequired}
            editorOptions={{
              ...resultDataOption,
              valueExpr: "id",
              displayExpr: "name",
              searchEnabled: true
            }}
          >
            {fieldForm.resultId.isRequired && <RequiredRule message="Result is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="ptpDate"
            editorType={"dxDateBox"}
            label={{ text: "PTP Date" }}
            visible={fieldForm.ptpDate.visible}
            isRequired={fieldForm.ptpDate.isRequired}
            editorOptions={{
              type: "date",
              pickerType: "calender",
              displayFormat: "dd/MM/yyyy"
            }}
          >
            {fieldForm.ptpDate.isRequired && <RequiredRule message="PTP Date is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="ptpAmount"
            editorType="dxTextBox"
            label={{ text: "PTP Amount" }}
            visible={fieldForm.ptpAmount.visible}
            isRequired={fieldForm.ptpAmount.isRequired}
            editorOptions={{
              value: activityContactData.ptpAmount || "",
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
            {fieldForm.ptpAmount.isRequired && <RequiredRule message="PTP Amount is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="purposeVisitId"
            label={{ text: "Purpose of Visit" }}
            editorType="dxSelectBox"
            editorOptions={purposeVisitOptions}
            visible={fieldForm.purposeVisitId.visible}
            isRequired={fieldForm.purposeVisitId.isRequired}
          />

          <SimpleItem
            dataField="purposeCallId"
            label={{ text: "Purpose of Call" }}
            editorType="dxSelectBox"
            editorOptions={purposeCallOptions}
            visible={fieldForm.purposeCallId.visible}
            isRequired={fieldForm.purposeCallId.isRequired}
          />

          <SimpleItem
            dataField="salesOfferingId"
            label={{ text: "Sales Offering" }}
            editorType="dxSelectBox"
            editorOptions={salesOfferingOptions}
            visible={fieldForm.salesOfferingId.visible}
            isRequired={fieldForm.salesOfferingId.isRequired}
          />

          <SimpleItem
            dataField="currentGeoposition"
            editorType={"dxCheckBox"}
            editorOptions={{ text: "Current Geoposition: *" }}
            label={{ visible: false }}
            visible={fieldForm.currentGeoposition.visible}
            isRequired={fieldForm.currentGeoposition.isRequired}
          >
            <RequiredRule message="Current geoposition is required" />
          </SimpleItem>
          <Item visible={geoposition.isStreetShop && fieldForm.currentGeoposition.visible}>
            <GoogleMapsLocation center={center} />
          </Item>

          <SimpleItem
            dataField="photo"
            editorType={"dxFileUploader" as any}
            editorOptions={uploadPhotoOptions}
            label={{ text: "Photo" }}
            visible={fieldForm.photo.visible}
            isRequired={fieldForm.photo.isRequired}
          >
            {fieldForm.photo.isRequired && <RequiredRule message="Photo is required" />}
          </SimpleItem>
          <Item visible={image !== "" && fieldForm.photo.visible}>
            <img src={image} alt="foto" width="250px" style={{ marginTop: -16 }} />
          </Item>

          <SimpleItem
            dataField="comment"
            label={{ text: "Comment" }}
            editorType="dxTextArea"
            visible={fieldForm.comment.visible}
            isRequired={fieldForm.comment.isRequired}
          />

          <GroupItem
            cssClass={
              "dx-toolbar dx-widget dx-visibility-change-handler dx-collection dx-popup-bottom"
            }
            colCount={2}
          >
            <ButtonItem horizontalAlignment="left">
              <ButtonOptions width={"100%"} onClick={handleCloseModal}>
                <span className="dx-button-text">Tutup</span>
              </ButtonOptions>
            </ButtonItem>

            <ButtonItem horizontalAlignment="left">
              <ButtonOptions
                type="default"
                width={"100%"}
                disabled={loading}
                useSubmitBehavior={true}
              >
                <div className="button-options">
                  <LoadIndicator width="20px" height="20px" visible={loading} />
                  <span className="dx-button-text">Simpan</span>
                </div>
              </ButtonOptions>
            </ButtonItem>
          </GroupItem>
        </Form>
      </form>
    </Popup>
  );
}
