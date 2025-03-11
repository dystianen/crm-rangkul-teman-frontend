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
import React, { Ref, useCallback, useEffect, useState } from "react";
import { ajaxPatch, ajaxPost } from "src/api/http.api";
import useUserRole from "src/utils/configUserRole.util";
import imageCompress from "src/utils/imageCompress.util";
import {
  activityResultStore,
  activityTypeStore,
  purposeCallStore,
  purposeVisitStore,
  salesOfferingStore,
  selectBoxOptions
} from "../../api/contact";
import GoogleMapsLocation from "../google-maps-location/GoogleMapsLocation";

export interface IContactActivity {
  contactId?: string;
  id?: string;
  comment?: string;
  resultId?: string;
  typeId?: string;
}

interface ActivityContactProps {
  children?: React.ReactChild | React.ReactChild[];
  className?: string;
  activityContactData: IContactActivity;
  isModalVisible: boolean;
  onSubmit: (e: any) => void;
  onCloseModal: (e: any) => void;
  formActivityRef?: Ref<any>;
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
  const [streetShopData, setStreetShopData] = useState({
    isStreetShop: false,
    latitude: "",
    longitude: ""
  });

  const [photo, setPhoto] = useState("");

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
    setLoading(true);
    console.log({ activityContactData });
    event.preventDefault();
    if (activityContactData.id) {
      await ajaxPatch(
        `/api/contact/activity/update/${activityContactData.id}`,
        activityContactData
      );
    } else {
      await ajaxPost("/api/contact/activity/create", activityContactData);
    }

    setLoading(false);
    setActivityContactData({
      contactId: undefined,
      id: undefined,
      comment: undefined,
      resultId: undefined,
      typeId: undefined
    });
    props.onSubmit(event);
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

  const onFieldAppDataChanged = (evt: any) => {
    // Activity Type
    if (evt.dataField === "typeId" && evt.value != null) {
      setResultDataOption(
        selectBoxOptions(new DataSource(activityResultStore(evt.value)), "Select Result")
      );
      activityContactData["resultId"] = undefined;
    }

    // Street Shop
    if (evt.dataField === "streetShop" && evt.value != null) {
      const checked = evt.value;
      if (checked) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setCenter({ lat, lng });

            setStreetShopData({
              isStreetShop: true,
              latitude: lat.toString(),
              longitude: lng.toString()
            });
          });
        }
      } else {
        setStreetShopData({ isStreetShop: false, latitude: "", longitude: "" });
      }
    }

    // @ts-expect-error
    activityContactData[evt.dataField] = evt.value;
  };

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
      setPhoto(uri.base64);
    }
  }, []);

  const uploadPhotoOptions = {
    selectButtonText: "Select photo",
    accept: "image/*",
    uploadMode: "useForm",
    onValueChanged: onFileChanged
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
    ptpDate: (isSoftCollector || isCollectionManager || isHeadOfCollection) && isCall,
    ptpAmount: (isSoftCollector || isCollectionManager || isHeadOfCollection) && isCall,
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
      onHiding={props.onCloseModal}
      width={window.innerWidth <= 600 ? "auto" : 500}
      maxHeight={600}
      fullScreen={window.innerWidth <= 600}
    >
      <form onSubmit={onSubmit}>
        <Form
          ref={props.formActivityRef}
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
            editorOptions={uploadPhotoOptions}
            label={{ text: "PTP Date" }}
            visible={fieldVisibility.ptpDate}
          >
            {fieldRequired.ptpDate && <RequiredRule message="PTP Date is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="ptpAmount"
            editorType="dxTextBox"
            editorOptions={uploadPhotoOptions}
            label={{ text: "PTP Amount" }}
            visible={fieldVisibility.ptpAmount}
          >
            {fieldRequired.ptpAmount && <RequiredRule message="PTP Amount is required" />}
          </SimpleItem>

          <SimpleItem
            dataField="purposeOfVisit"
            label={{ text: "Purpose of Visit" }}
            editorType="dxSelectBox"
            editorOptions={purposeVisitOptions}
            visible={fieldVisibility.purposeOfVisit}
          />

          <SimpleItem
            dataField="purposeOfCall"
            label={{ text: "Purpose of Call" }}
            editorType="dxSelectBox"
            editorOptions={purposeCallOptions}
            visible={fieldVisibility.purposeOfCall}
          />

          <SimpleItem
            dataField="salesOffering"
            label={{ text: "Sales Offering" }}
            editorType="dxSelectBox"
            editorOptions={salesOfferingOptions}
            visible={fieldVisibility.salesOffering}
          />

          <SimpleItem
            dataField="streetShop"
            editorType={"dxCheckBox"}
            editorOptions={{ text: "Street Shop: *" }}
            label={{ visible: false }}
            visible={fieldVisibility.currentGeoposition}
          >
            <RequiredRule message="Street shop location is required" />
          </SimpleItem>
          <Item>{streetShopData.isStreetShop && <GoogleMapsLocation center={center} />}</Item>

          <SimpleItem
            dataField="photo"
            editorType={"dxFileUploader" as any}
            editorOptions={uploadPhotoOptions}
            label={{ text: "Photo" }}
            visible={fieldVisibility.photo}
          >
            <RequiredRule message="Photo is required" />
          </SimpleItem>
          <Item visible={photo !== ""}>
            <img src={photo} alt="foto" width="250px" style={{ marginTop: -16 }} />
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
              <ButtonOptions width={"100%"} onClick={props.onCloseModal}>
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
