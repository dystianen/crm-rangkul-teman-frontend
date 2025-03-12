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
  activityResultStore,
  activityTypeStore,
  getFile,
  purposeCallStore,
  purposeVisitStore,
  salesOfferingStore,
  selectBoxOptions
} from "src/api/contact";
import { ajaxPatch, ajaxPost } from "src/api/http.api";
import useUserRole from "src/utils/configUserRole.util";
import { convertToUTCString } from "src/utils/dateUtils";
import imageCompress from "src/utils/imageCompress.util";
import GoogleMapsLocation from "../google-maps-location/GoogleMapsLocation";
import "./activity-form.scss";

export interface IContactActivity {
  contactId?: string;
  id?: string;
  comment?: string;
  resultId?: string;
  typeId?: string;
  currentGeoposition?: boolean;
  ptpAmount?: number;
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

export default function ActivityContactForm(props: ActivityContactProps) {
  const [loading, setLoading] = useState(false);
  const [resultDataOption, setResultDataOption] = useState<any>({});
  const [activityContactData, setActivityContactData] = useState<IContactActivity>(
    props.activityContactData
  );
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
      getFile(data.image)
        .then((response) => setImage(response))
        .catch((error) => console.error("ERROR:: ", error));
    }

    if (data.latitude && data.longitude) {
      setGeoposition({
        isStreetShop: true,
        latitude: data.latitude,
        longitude: data.longitude
      });
    }
  }, [props.activityContactData]);

  const {
    isCollectionManager,
    isFieldCollector,
    isHeadOfCollection,
    isSalesAgent,
    isSalesApprover1,
    isSoftCollector,
    isVerificator,
    isWABABot
  } = useUserRole();

  const onSubmit = async (event: any) => {
    try {
      setLoading(true);
      event.preventDefault();
      delete activityContactData.currentGeoposition;
      const payload = {
        ...activityContactData,
        photo: image,
        latitude: geoposition.latitude,
        longitude: geoposition.longitude,
        ptpAmount: Number(activityContactData.ptpAmount),
        ptpDate: convertToUTCString(new Date(activityContactData.ptpDate || ""))
      };

      if (activityContactData.id) {
        await ajaxPatch(`/api/contact/activity/update/${activityContactData.id}`, payload);
      } else {
        await ajaxPost("/api/contact/activity/create", payload);
      }

      setLoading(false);
      resetGeoposition();
      setImage("");
      props.onSubmit(event);
    } catch (err) {
      setLoading(false);
    }
  };

  const typeOptions = selectBoxOptions(new DataSource(activityTypeStore), "Select Type");
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
    if (!evt || !evt.dataField) return;

    // Activity Type
    if (evt.dataField === "typeId" && evt.value != null) {
      setResultDataOption(
        selectBoxOptions(new DataSource(activityResultStore(evt.value)), "Select Result")
      );
      setActivityContactData((prev) => ({
        ...prev,
        resultId: undefined
      }));
      return;
    }

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

    setActivityContactData((prev) => ({
      ...prev,
      [evt.dataField]: evt.value
    }));
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
    props.onCloseModal(e);
  };

  const isFieldVisit = activityContactData.typeId === "86ebc4dd-0d23-43c0-a337-cdbf72271c73";
  const isVisit = activityContactData.typeId === "b531afb1-bab2-4e29-9959-fa6fe4dea023";
  const isCall = activityContactData.typeId === "738e2341-4103-458c-8d56-a765d3e64738";
  const isPTP = activityContactData.resultId === "5d5c08f0-7ee7-4ecb-95a9-6804df059c19";

  const fieldVisibility = {
    typeId: true,
    resultId: true,
    comment: true,
    photo:
      (isFieldCollector ||
        isCollectionManager ||
        isHeadOfCollection ||
        isSalesAgent ||
        isVerificator ||
        isSalesApprover1) &&
      !isCall,
    purposeOfVisit: (isSalesAgent || isVerificator || isSalesApprover1 || isWABABot) && !isCall,
    purposeOfCall: (isSalesAgent || isVerificator || isSalesApprover1 || isWABABot) && isCall,
    salesOffering: isSalesAgent || isVerificator || isSalesApprover1 || isWABABot,
    ptpDate: isFieldCollector || isSoftCollector || isCollectionManager || isHeadOfCollection,
    ptpAmount: isFieldCollector || isSoftCollector || isCollectionManager || isHeadOfCollection,
    currentGeoposition: isFieldVisit || isVisit
  };

  const fieldRequired = {
    ptpDate: isPTP,
    ptpAmount: isPTP
  };

  return (
    <Popup
      visible={props.isModalVisible}
      title="Activity Form"
      width={window.innerWidth <= 600 ? "auto" : 500}
      maxHeight={600}
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
            dataField="typeId"
            label={{ text: "Activity Type" }}
            editorType="dxSelectBox"
            editorOptions={typeOptions}
          >
            <RequiredRule message="Type is required" />
          </SimpleItem>
          <SimpleItem
            dataField="resultId"
            label={{ text: "Result" }}
            editorType="dxSelectBox"
            editorOptions={{
              ...resultDataOption,
              valueExpr: "resultId",
              displayExpr: "resultName",
              searchEnabled: true
            }}
          >
            <RequiredRule message="Result is required" />
          </SimpleItem>

          <SimpleItem
            dataField="ptpDate"
            editorType={"dxDateBox"}
            label={{ text: "PTP Date" }}
            visible={fieldVisibility.ptpDate}
            editorOptions={{
              type: "date",
              pickerType: "calender",
              displayFormat: "dd/MM/yyyy"
            }}
          >
            {fieldRequired.ptpDate && <RequiredRule message="PTP Date is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="ptpAmount"
            editorType="dxTextBox"
            label={{ text: "PTP Amount" }}
            visible={fieldVisibility.ptpAmount}
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
            {fieldRequired.ptpAmount && <RequiredRule message="PTP Amount is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="purposeVisitId"
            label={{ text: "Purpose of Visit" }}
            editorType="dxSelectBox"
            editorOptions={purposeVisitOptions}
            visible={fieldVisibility.purposeOfVisit}
          />

          <SimpleItem
            dataField="purposeCallId"
            label={{ text: "Purpose of Call" }}
            editorType="dxSelectBox"
            editorOptions={purposeCallOptions}
            visible={fieldVisibility.purposeOfCall}
          />

          <SimpleItem
            dataField="salesOfferingId"
            label={{ text: "Sales Offering" }}
            editorType="dxSelectBox"
            editorOptions={salesOfferingOptions}
            visible={fieldVisibility.salesOffering}
          />

          <SimpleItem
            dataField="currentGeoposition"
            editorType={"dxCheckBox"}
            editorOptions={{ text: "Current Geoposition: *" }}
            label={{ visible: false }}
            visible={fieldVisibility.currentGeoposition}
          >
            <RequiredRule message="Current geoposition is required" />
          </SimpleItem>
          <Item visible={geoposition.isStreetShop}>
            <GoogleMapsLocation center={center} />
          </Item>

          <SimpleItem
            dataField="photo"
            editorType={"dxFileUploader" as any}
            editorOptions={uploadPhotoOptions}
            label={{ text: "Photo" }}
            visible={fieldVisibility.photo}
          >
            <RequiredRule message="Photo is required" />
          </SimpleItem>
          <Item visible={image !== ""}>
            <img src={image} alt="foto" width="250px" style={{ marginTop: -16 }} />
          </Item>

          <SimpleItem
            dataField="comment"
            label={{ text: "Comment" }}
            editorType="dxTextArea"
            visible={fieldVisibility.comment}
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
