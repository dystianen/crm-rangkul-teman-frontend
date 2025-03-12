import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { CheckBox } from "devextreme-react";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "250px"
};

const defaultCenter = {
  lat: -6.2262903,
  lng: 106.8325905
};

interface StreetShopProps {
  value?: { isStreetShop: boolean; latitude: string; longitude: string };
  onValueChanged?: (data: { isStreetShop: boolean; latitude: string; longitude: string }) => void;
}

const StreetShop = ({
  value = { isStreetShop: false, latitude: "", longitude: "" },
  onValueChanged
}: StreetShopProps) => {
  const [center, setCenter] = useState(defaultCenter);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  });

  useEffect(() => {
    if (value.isStreetShop && value.latitude && value.longitude) {
      setCenter({
        lat: Number(value.latitude),
        lng: Number(value.longitude)
      });
    }
  }, [value]);

  const handleChangeStreetShop = (checked: boolean) => {
    if (onValueChanged) {
      if (checked) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              setCenter({ lat, lng });

              onValueChanged({
                isStreetShop: true,
                latitude: lat.toString(),
                longitude: lng.toString()
              });
            },
            () => {
              onValueChanged({
                isStreetShop: true,
                latitude: defaultCenter.lat.toString(),
                longitude: defaultCenter.lng.toString()
              });
            }
          );
        } else {
          onValueChanged({
            isStreetShop: true,
            latitude: defaultCenter.lat.toString(),
            longitude: defaultCenter.lng.toString()
          });
        }
      } else {
        onValueChanged({ isStreetShop: false, latitude: "", longitude: "" });
      }
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: value.isStreetShop ? 10 : 0 }}>
        <CheckBox
          value={value.isStreetShop}
          onValueChanged={(e) => handleChangeStreetShop(e.value)}
          elementAttr={{ "aria-label": "Is Street Shop" }}
        />
        <p className="dx-field-item-label-text">Street Shop</p>
      </div>

      {value.isStreetShop && isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{ disableDoubleClickZoom: false, draggable: false }}
        >
          <Marker position={center} />
        </GoogleMap>
      ) : null}
    </>
  );
};

export default StreetShop;
