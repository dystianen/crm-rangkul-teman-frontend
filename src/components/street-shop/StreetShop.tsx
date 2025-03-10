import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { CheckBox } from "devextreme-react";
import { useCallback, useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "250px"
};

const defaultCenter = {
  lat: -6.2262903,
  lng: 106.8325905
};

interface StreetShopProps {
  streetShopData: {
    isStreetShop: boolean;
    latitude: string;
    longitude: string;
  };
  onChange: (data: { isStreetShop: boolean; latitude: string; longitude: string }) => void;
  disabled?: boolean;
}

const StreetShop = ({ streetShopData, onChange, disabled = false }: StreetShopProps) => {
  console.log("🚀 ~ StreetShop ~ streetShopData:", streetShopData);
  const [center, setCenter] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  });

  useEffect(() => {
    if (streetShopData.isStreetShop && streetShopData.latitude && streetShopData.longitude) {
      setCenter({
        lat: Number(streetShopData.latitude),
        lng: Number(streetShopData.longitude)
      });
    }
  }, [streetShopData]);

  const handleChangeStreetShop = useCallback((value: boolean) => {
    console.log("🚀 ~ handleChangeStreetShop ~ value:", value);

    if (value) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            console.log("📍 Geolocation success:", lat, lng);

            setCenter({ lat, lng });

            onChange({
              isStreetShop: true,
              latitude: lat.toString(),
              longitude: lng.toString()
            });
          },
          (error) => {
            console.error("❌ Geolocation error:", error);

            // Jika gagal, tetap update state dengan data default
            onChange({
              isStreetShop: true,
              latitude: defaultCenter.lat.toString(),
              longitude: defaultCenter.lng.toString()
            });
          }
        );
      } else {
        console.warn("⚠️ Geolocation not supported");
        onChange({
          isStreetShop: true,
          latitude: defaultCenter.lat.toString(),
          longitude: defaultCenter.lng.toString()
        });
      }
    } else {
      // Jika checkbox di-uncheck, reset data lokasi
      // onChange({ isStreetShop: false, latitude: "", longitude: "" });
    }
  }, []);

  return (
    <>
      <div
        style={{ display: "flex", gap: "10px", marginBottom: streetShopData.isStreetShop ? 10 : 0 }}
      >
        <CheckBox
          disabled={disabled}
          value={streetShopData.isStreetShop}
          onValueChanged={(e) => handleChangeStreetShop(e.value)}
          elementAttr={{ "aria-label": "Is Street Shop" }}
        />
        <h3>Street Shop</h3>
      </div>

      {streetShopData.isStreetShop && isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{
            disableDoubleClickZoom: false,
            draggable: false
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      ) : null}
    </>
  );
};

export default StreetShop;
