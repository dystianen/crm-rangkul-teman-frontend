import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Button, CheckBox, Popup } from "devextreme-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getStreetShop, submitStreetShop } from "src/api/apploan";

const containerStyle = {
  width: "100%",
  height: "500px"
};

const defaultCenter = {
  lat: -6.2262903,
  lng: 106.8325905
};

const StreetShop = ({ appId, disabled = false }: { appId: string; disabled?: boolean }) => {
  const [isStreetShop, setIsStreetShop] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
  const [isShowPopupConfirm, setShowPopupConfirm] = useState(false);

  useEffect(() => {
    getStreetShop(appId).then((res) => {
      setIsStreetShop(res.isStreetShop ?? false);
      setCenter({
        lat: Number(res.latitude),
        lng: Number(res.longitude)
      });
    });
  }, [appId]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  });

  const onLoad = useCallback(
    function callback(map: any) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
    },
    [center]
  );

  const isHandlingPopup = useRef(false);
  const handleChangeStreetShop = useCallback(
    (value: boolean) => {
      if (isHandlingPopup.current) {
        isHandlingPopup.current = false;
        return;
      }

      if (value === false) {
        setShowPopupConfirm(true);
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setCenter({ lat, lng });

            const payload = {
              isStreetShop: value,
              latitude: value ? lat.toString() : "",
              longitude: value ? lng.toString() : ""
            };

            submitStreetShop(appId, payload).then(() => {
              getStreetShop(appId).then((res) => {
                setIsStreetShop(res.isStreetShop ?? false);
                if (res.isStreetShop) {
                  setCenter({
                    lat: Number(res.latitude),
                    lng: Number(res.longitude)
                  });
                }
              });
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    },
    [appId]
  );

  const handleCancelChangeGeoPos = useCallback(() => {
    setIsStreetShop(true);
    setShowPopupConfirm(false);
  }, []);

  const handleYesChangeGeoPos = useCallback(() => {
    const payload = {
      isStreetShop: false,
      latitude: "",
      longitude: ""
    };

    submitStreetShop(appId, payload).then(() => {
      setIsStreetShop(false);
      setShowPopupConfirm(false);
    });
  }, [appId]);

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: isStreetShop ? 16 : 0 }}>
        <CheckBox
          disabled={disabled}
          value={isStreetShop}
          onValueChanged={(e) => {
            handleChangeStreetShop(e.value);
            setIsStreetShop(e.value);
          }}
          elementAttr={{ "aria-label": "Is Street Shop" }}
        />
        <h3>Street Shop</h3>
      </div>

      {isStreetShop && isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          options={{
            disableDoubleClickZoom: false,
            draggable: false
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      ) : null}

      <Popup width={360} height={"auto"} visible={isShowPopupConfirm} showTitle={false}>
        <div className="wrapper-popup-waiting">
          <h5 className="title">
            You are trying to change existing geoposition. Are you sure you want to do that?
          </h5>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button text="Cancel" type="default" onClick={handleCancelChangeGeoPos} />
            <Button text="yes" type="normal" onClick={handleYesChangeGeoPos} />
          </div>
        </div>
      </Popup>
    </>
  );
};

export default StreetShop;
