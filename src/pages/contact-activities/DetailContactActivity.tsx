import { Button, Form } from "devextreme-react";
import { DataGridTypes } from "devextreme-react/cjs/data-grid";
import { GroupItem, Item, SimpleItem } from "devextreme-react/cjs/form";
import { useEffect, useState } from "react";
import { getFile } from "src/api/contact";
import GoogleMapsLocation from "src/components/google-maps-location/GoogleMapsLocation";
import { convertToDMS, copyToClipboard } from "src/utils/helpers";

const defaultCenter = {
  lat: -6.2262903,
  lng: 106.8325905
};

const DetailContactActivity = (props: DataGridTypes.MasterDetailTemplateData) => {
  const { categoryId, photo, latitude, longitude } = props.data.data;
  const [file, setFile] = useState("");
  const [center, setCenter] = useState(defaultCenter);

  const isCollection = categoryId === "8aa1778c-9b63-45d3-905a-a724137c81b0";
  const isSales = categoryId === "e293bd9a-b321-432a-91e2-86fd8e7d65ac";

  useEffect(() => {
    if (photo) {
      getFile(photo).then(setFile);
    }

    if (latitude && longitude) {
      setCenter({
        lat: Number(latitude),
        lng: Number(longitude)
      });
    }
  }, [latitude, longitude, photo]);

  return (
    <Form
      colCount={2}
      id="form"
      formData={props.data.data}
      showColonAfterLabel={true}
      showValidationSummary={true}
      validationGroup="contactData"
    >
      <GroupItem colSpan={2}>
        <GroupItem caption="Detail Information" colCount={2}>
          <SimpleItem
            dataField="modifiedByName"
            label={{ text: "Modified By" }}
            editorOptions={{
              readOnly: true
            }}
          />
          <SimpleItem
            dataField="modifiedOn"
            label={{ text: "Modified At" }}
            editorOptions={{
              displayFormat: "dd MMM yyyy HH:mm:ss",
              type: "datetime",
              readOnly: true
            }}
            editorType="dxDateBox"
          />
          <SimpleItem
            dataField="categoryName"
            label={{ text: "Category" }}
            editorOptions={{
              readOnly: true
            }}
          />
          <SimpleItem
            dataField="typeName"
            label={{ text: "Type" }}
            editorOptions={{
              readOnly: true
            }}
          />
          <SimpleItem
            dataField="resultName"
            label={{ text: "Result" }}
            editorOptions={{
              readOnly: true
            }}
          />

          {/* START COLLECTION */}
          <SimpleItem
            dataField="ptpDate"
            label={{ text: "PTP Date" }}
            editorOptions={{
              displayFormat: "dd MMM yyyy",
              type: "datetime",
              readOnly: true
            }}
            visible={isCollection}
            editorType="dxDateBox"
          />
          <SimpleItem
            dataField="ptpAmount"
            label={{ text: "PTP Amount" }}
            editorOptions={{
              readOnly: true
            }}
            visible={isCollection}
          />
          {/* END COLLECTION */}

          {/* START SALES */}
          <SimpleItem
            dataField="purposeCallName"
            label={{ text: "Purpose of Call" }}
            editorOptions={{
              readOnly: true
            }}
            visible={isSales}
          />
          <SimpleItem
            dataField="purposeVisitName"
            label={{ text: "Purpose of Visit" }}
            editorOptions={{
              readOnly: true
            }}
            visible={isSales}
          />
          <SimpleItem
            dataField="salesOfferingName"
            label={{ text: "Sales Offering" }}
            editorOptions={{
              readOnly: true
            }}
            visible={isSales}
          />
          {/* END SALES */}

          <SimpleItem
            dataField="name"
            label={{ text: "Comment" }}
            editorOptions={{
              readOnly: true
            }}
          />
          <SimpleItem visible={file !== ""} label={{ text: "Photo" }}>
            <img src={file} alt="file" width={300} />
          </SimpleItem>
          <GroupItem visible={latitude !== null && longitude !== null}>
            <SimpleItem
              label={{ text: "Geo Location" }}
              editorOptions={{
                readOnly: true
              }}
            />
            <Item>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <a
                  href={`https://www.google.com/maps?q=${center.lat},${center.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    padding: "3px 8px",
                    borderRadius: "5px",
                    backgroundColor: "#f8f9fa"
                  }}
                >
                  <img
                    src="/assets/images/ic_google_maps.png"
                    alt="Google Maps"
                    width={10}
                    style={{ display: "inline-block" }}
                  />
                  {convertToDMS(center.lat, center.lng)}
                </a>
                <Button
                  onClick={() =>
                    copyToClipboard(`https://www.google.com/maps?q=${center.lat},${center.lng}`)
                  }
                  icon="copy"
                />
              </div>
            </Item>
            <Item>
              <div style={{ width: 400 }}>
                <GoogleMapsLocation center={center} />
              </div>
            </Item>
          </GroupItem>
        </GroupItem>
      </GroupItem>
    </Form>
  );
};

export default DetailContactActivity;
