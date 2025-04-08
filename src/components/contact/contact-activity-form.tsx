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
import {useCallback, useEffect, useRef, useState} from "react";
import {
  activityCategoryStore, activityResultByTypeStore,
  activityResultStore, activityTypeByCategoryStore, activityTypeFieldForm, getFile,
  purposeCallStore,
  purposeVisitStore,
  salesOfferingStore,
  selectBoxOptions
} from "src/api/contact";
import { ajaxPatch, ajaxPost } from "src/api/http.api";
import { convertToUTCString } from "src/utils/dateUtils";
import { notifyError } from "src/utils/devExtremeUtils";
import { allowOnlyNumbers } from "src/utils/helpers";
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
  contactId: string,
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
  const formRef = useRef<Form>(null);
  const [loading, setLoading] = useState(false);
  const [resultDataOption, setResultDataOption] = useState<any>({});
  const [activityContactData, setActivityContactData] = useState<IContactActivity>({});
  const [typeOptions, setTypeOptions] = useState<any>({});
  const [fieldListForm, setFieldListForm] = useState<any[]>([])

  const [center, setCenter] = useState(defaultCenter);
  const [geoposition, setGeoposition] = useState({
    isStreetShop: false,
    latitude: "",
    longitude: ""
  });
  const [image, setImage] = useState("");

  useEffect(() => {
    const data = props.activityContactData;
    console.log("props.activityContactData", props.activityContactData);
    setGeoposition({
      isStreetShop: ((typeof data.latitude !=="undefined") && (typeof data.longitude !== "undefined") && data.latitude.length > 0 && data.longitude.length > 0),
      latitude: data.latitude || "",
      longitude: data.longitude || ""
    });

    // setImage((data.image || ""));

    if(typeof data.image !== "undefined" && data.image.length > 0){
      getFile(data.image)
      .then(response => setImage(response))
      .catch(error => console.error("ERROR:: ", error));
      // imageUrlToBase64(data.image).then((rs)=>{
      //   console.log("base64  dari list", rs)
      // })
      // .catch(error => console.error("ERROR PHOTO:: ", error));
    }

    setActivityContactData(props.activityContactData);
  }, [props.activityContactData]);

  useEffect(() => {
    console.log(" image filled", image);
  }, [image]);
  

  const [resultFieldForm, setResultFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [commentFieldForm, setCommentFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [currentGeopositionFieldForm, setCurrentGeopositionFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [ptpDateFieldForm, setPtpDateFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [ptpAmountFieldForm, setPtpAmountFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [photoFieldForm, setPhotoFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [imageFieldForm, setImageFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [purposeVisitIdFieldForm, setPurposeVisitIdFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [purposeCallIdFieldForm, setPurposeCallIdFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });

  const [salesOfferingIdFieldForm, setSalesOfferingIdFieldForm] = useState<FieldAvailable>({
    visible: false,
    isRequired: false,
    displayOrder: 0,
  });
  

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setLoading(true);

      const updatedData = { ...activityContactData };
      delete updatedData.currentGeoposition;

      const payload: any = {
        ...updatedData,
        contactId: props.contactId,
        photo: image,
        latitude: geoposition.latitude,
        longitude: geoposition.longitude,
        ptpAmount: updatedData.ptpAmount ? Number(updatedData.ptpAmount) : null,
        ptpDate: updatedData.ptpDate ? convertToUTCString(new Date(updatedData.ptpDate)) : null
      };


      if (updatedData.id) {
        await ajaxPatch(`/api/contact/activity/update/${updatedData.id}`, payload).then(
            ()=>{
              
          resetGeoposition();

          if (image === updatedData.image || !isBase64(image)) {
            delete payload.photo;
          }

          delete payload.image;
          resetFieldForm();
          setTypeOptions(selectBoxOptions(new DataSource([]), "Select Activity Type"));
        });
      } else {
        await ajaxPost("/api/contact/activity/create", payload).then(
            ()=> {
              
          resetGeoposition();

          if (image === updatedData.image || !isBase64(image)) {
            delete payload.photo;
          }

          delete payload.image;
          resetFieldForm();
          setTypeOptions(selectBoxOptions(new DataSource([]), "Select Activity Type"));
        });
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
    "Select Purpose Call"
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
    }

    if(evt.dataField === "typeId" && evt.value !== null) {
      setActivityContactData((prev) => ({
        ...prev,
        typeId: evt.value,
        resultId: "",
        comment: "",
        currentGeoposition: false,
        ptpAmount: "",
        ptpDate: "",
        photo: "",
        image: "",
        purposeVisitId: "",
        purposeCallId: "",
        latitude: "",
        longitude: "",
        salesOfferingId: ""
      }));
      setImage("");
      resetGeoposition();
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
    setImage("");
    setActivityContactData(props.activityContactData);
    resetFieldForm();
    setTypeOptions(selectBoxOptions(new DataSource([]), "Select Activity Type"));
    props.onCloseModal(e);
  };

  const resetFieldForm = () => {
    setResultFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
    setPhotoFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
    setCommentFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
    setPtpDateFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
    setPtpAmountFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
    setCurrentGeopositionFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
    setSalesOfferingIdFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
    setPurposeCallIdFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
    setPurposeVisitIdFieldForm({
      visible: false,
      isRequired: false,
      displayOrder: 0,
    });
  }

  const onChangeCategory = (e:any) => {
    console.log("onChangeCategory", e);
    if(e.value != null && e.value.length > 0){
      const selectOptions = selectBoxOptions(new DataSource(activityTypeByCategoryStore(e.value)), "Select Activity Type");
      setTypeOptions(selectOptions);
    }
    resetFieldForm();
  }

  const onChangeType = (e:any) => {
    console.log("onChangeType", e);
    if(e.value != null && e.value.length > 0) {
      setResultDataOption(
        selectBoxOptions(new DataSource(activityResultByTypeStore(e.value)), "Select Result")
      );
      activityTypeFieldForm(e.value).then((rs: any)=> {
        setFieldListForm(rs);
        let result = rs.find((f:any)=>f.field===contactActivityFieldForm.RESULT);
        setResultFieldForm({
          visible: (typeof result !== "undefined"), displayOrder: (typeof result !== "undefined") && result.displayOrder, isRequired: (typeof result !== "undefined") && result.isRequired
        });

        let photo = rs.find((f:any)=>f.field===contactActivityFieldForm.PHOTO);
        setPhotoFieldForm({
          visible: (typeof photo !== "undefined"), displayOrder: (typeof photo !== "undefined") && photo.displayOrder, isRequired: (typeof photo !== "undefined") && photo.isRequired
        });

        let currentPosition = rs.find((f:any)=>f.field===contactActivityFieldForm.CURRENT_GEO_POSITION);
        setCurrentGeopositionFieldForm({
          visible: (typeof currentPosition !== "undefined"), displayOrder: (typeof currentPosition !== "undefined") && currentPosition.displayOrder, isRequired: (typeof currentPosition !== "undefined") && currentPosition.isRequired
        });

        let comment = rs.find((f:any)=>f.field===contactActivityFieldForm.COMMENT);
        setCommentFieldForm({
          visible: (typeof comment !== "undefined"), displayOrder: (typeof comment !== "undefined") && comment.displayOrder, isRequired: (typeof comment !== "undefined") && comment.isRequired
        });

        let ptpDate = rs.find((f:any)=>f.field===contactActivityFieldForm.PTP_DATE);
        setPtpDateFieldForm({
          visible: (typeof ptpDate !== "undefined"), displayOrder: (typeof ptpDate !== "undefined") && ptpDate.displayOrder, isRequired: (typeof ptpDate !== "undefined") && ptpDate.isRequired
        });

        let ptpAmount = rs.find((f:any)=>f.field===contactActivityFieldForm.PTP_AMOUNT);
        setPtpAmountFieldForm({
          visible: (typeof ptpAmount !== "undefined"), displayOrder: (typeof ptpAmount !== "undefined") && ptpAmount.displayOrder, isRequired: false
        });

        let purposeVisitId = rs.find((f:any)=>f.field===contactActivityFieldForm.PURPOSE_OF_VISIT);
        setPurposeVisitIdFieldForm({
          visible: (typeof purposeVisitId !== "undefined"), displayOrder: (typeof purposeVisitId !== "undefined") && purposeVisitId.displayOrder, isRequired: (typeof purposeVisitId !== "undefined") && purposeVisitId.isRequired
        });

        let purposeCallId = rs.find((f:any)=>f.field===contactActivityFieldForm.PURPOSE_OF_CALL);
        setPurposeCallIdFieldForm({
          visible: (typeof purposeCallId !== "undefined"), displayOrder: (typeof purposeCallId !== "undefined") && purposeCallId.displayOrder, isRequired: (typeof purposeCallId !== "undefined") && purposeCallId.isRequired
        });
        let salesOfferingId = rs.find((f:any)=>f.field===contactActivityFieldForm.SALES_OFFERING);
        setSalesOfferingIdFieldForm({
          visible: (typeof salesOfferingId !== "undefined"), displayOrder: (typeof salesOfferingId !== "undefined") && salesOfferingId.displayOrder, isRequired: (typeof salesOfferingId !== "undefined") && salesOfferingId.isRequired
        });
        
      });
    }
  }

  const onChangeResult = (e: any) => {
    console.log("onChange result", e, activityContactData.typeId);
    let ptpDate = fieldListForm.find((f:any)=>f.field===contactActivityFieldForm.PTP_DATE);
    let ptpAmount = fieldListForm.find((f:any)=>f.field===contactActivityFieldForm.PTP_AMOUNT);
    if("738e2341-4103-458c-8d56-a765d3e64738" == activityContactData.typeId && "5d5c08f0-7ee7-4ecb-95a9-6804df059c19"==e.value){
      setPtpDateFieldForm({
        visible: (typeof ptpDate !== "undefined"), displayOrder: (typeof ptpDate !== "undefined") && ptpDate.displayOrder, isRequired: true
      });
      setPtpAmountFieldForm({
        visible: (typeof ptpAmount !== "undefined"), displayOrder: (typeof ptpAmount !== "undefined") && ptpAmount.displayOrder, isRequired: true
      });
    } else {
      setPtpDateFieldForm({
        visible: (typeof ptpDate !== "undefined"), displayOrder: (typeof ptpDate !== "undefined") && ptpDate.displayOrder, isRequired: false
      });
      setPtpAmountFieldForm({
        visible: (typeof ptpAmount !== "undefined"), displayOrder: (typeof ptpAmount !== "undefined") && ptpAmount.displayOrder, isRequired: false
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
          ref={formRef}
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
              editorOptions={{...categoryOptions,
                onValueChanged: onChangeCategory
                
          }}
          >
            <RequiredRule message="Activity Category is required" />
          </SimpleItem>
          <SimpleItem
            dataField="typeId"
            label={{ text: "Activity Type" }}
            editorType="dxSelectBox"
            editorOptions={{...typeOptions, onValueChanged: onChangeType}}
          >
            <RequiredRule message="Activity Type is required" />
          </SimpleItem>
          <SimpleItem
            dataField="resultId"
            label={{ text: "Result" }}
            editorType="dxSelectBox"
            visible={resultFieldForm.visible}
            isRequired={resultFieldForm.isRequired}
            editorOptions={{
              ...resultDataOption,
              onValueChanged: onChangeResult,
              valueExpr: "id",
              displayExpr: "name",
              searchEnabled: true
            }}
          >
            {resultFieldForm.isRequired && <RequiredRule message="Result is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="ptpDate"
            editorType={"dxDateBox"}
            label={{ text: "PTP Date" }}
            visible={ptpDateFieldForm.visible}
            isRequired={ptpDateFieldForm.isRequired}
            editorOptions={{
              type: "date",
              pickerType: "calender",
              displayFormat: "dd/MM/yyyy"
            }}
          >
            {ptpDateFieldForm.isRequired && <RequiredRule message="PTP Date is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="ptpAmount"
            editorType="dxTextBox"
            label={{ text: "PTP Amount" }}
            visible={ptpAmountFieldForm.visible}
            isRequired={ptpAmountFieldForm.isRequired}
            editorOptions={{
              value: activityContactData.ptpAmount || "",
              onKeyDown: (e: any) => allowOnlyNumbers(e.event)
            }}
          >
            {ptpAmountFieldForm.isRequired && <RequiredRule message="PTP Amount is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="purposeVisitId"
            label={{ text: "Purpose of Visit" }}
            editorType="dxSelectBox"
            editorOptions={purposeVisitOptions}
            visible={purposeVisitIdFieldForm.visible}
            isRequired={purposeVisitIdFieldForm.isRequired}
          />

          <SimpleItem
            dataField="purposeCallId"
            label={{ text: "Purpose of Call" }}
            editorType="dxSelectBox"
            editorOptions={purposeCallOptions}
            visible={purposeCallIdFieldForm.visible}
            isRequired={purposeCallIdFieldForm.isRequired}
          />

          <SimpleItem
            dataField="salesOfferingId"
            label={{ text: "Sales Offering" }}
            editorType="dxSelectBox"
            editorOptions={salesOfferingOptions}
            visible={salesOfferingIdFieldForm.visible}
            isRequired={salesOfferingIdFieldForm.isRequired}
          />

          <SimpleItem
            dataField="currentGeoposition"
            editorType={"dxCheckBox"}
            editorOptions={{ text: "Current Geoposition: *" }}
            label={{ visible: false }}
            visible={currentGeopositionFieldForm.visible}
            isRequired={currentGeopositionFieldForm.isRequired}
          >
            <RequiredRule message="Current geoposition is required" />
          </SimpleItem>
          <Item visible={geoposition.isStreetShop && currentGeopositionFieldForm.visible}>
            <GoogleMapsLocation center={center} />
          </Item>

          <SimpleItem
            dataField="photo"
            editorType={"dxFileUploader" as any}
            editorOptions={uploadPhotoOptions}
            label={{ text: "Photo" }}
            visible={photoFieldForm.visible}
            isRequired={(activityContactData.id == "" && photoFieldForm.isRequired)}
          >
            {(activityContactData.id == "" && photoFieldForm.isRequired) && <RequiredRule message="Photo is required" />}
          </SimpleItem>
          <SimpleItem visible={(typeof image !== "undefined") && image.length > 0 && photoFieldForm.visible}>
            <img src={image} alt="foto" width="250px" style={{ marginTop: -16 }} />
          </SimpleItem>

          <SimpleItem
            dataField="comment"
            label={{ text: "Comment" }}
            editorType="dxTextArea"
            visible={commentFieldForm.visible}
            isRequired={commentFieldForm.isRequired}
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
