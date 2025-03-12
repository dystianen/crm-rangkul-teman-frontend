import { Button, CheckBox, Popup } from "devextreme-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getStreetShop, submitStreetShop } from "src/api/apploan";
import { notifySuccess } from "src/utils/devExtremeUtils";

const defaultCenter = {
  lat: -6.2262903,
  lng: 106.8325905
};

// 🔹 Fungsi untuk mengonversi koordinat desimal ke derajat-menit-detik (DMS)
const convertToDMS = (lat: number, lng: number) => {
  const toDMS = (value: number, direction1: string, direction2: string) => {
    const absValue = Math.abs(value);
    const degrees = Math.floor(absValue);
    const minutes = Math.floor((absValue - degrees) * 60);
    const seconds = ((absValue - degrees - minutes / 60) * 3600).toFixed(1);
    const direction = value >= 0 ? direction1 : direction2;
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return `${toDMS(lat, "N", "S")} ${toDMS(lng, "E", "W")}`;
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      notifySuccess("Copied to clipboard!");
    });
  };

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: isStreetShop ? 10 : 0 }}>
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

      {isStreetShop && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <strong>Location:</strong>
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
        </div>
      )}

      <Popup width={360} height={"auto"} visible={isShowPopupConfirm} showTitle={false}>
        <div className="wrapper-popup-waiting">
          <h5 className="title">
            You are trying to change existing geoposition. Are you sure you want to do that?
          </h5>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button text="Cancel" type="default" onClick={handleCancelChangeGeoPos} />
            <Button text="Yes" type="normal" onClick={handleYesChangeGeoPos} />
          </div>
        </div>
      </Popup>
    </>
  );
};

export default StreetShop;
