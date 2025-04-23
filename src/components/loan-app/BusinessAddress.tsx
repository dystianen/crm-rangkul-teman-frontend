import { Button, LoadIndicator, Popup } from "devextreme-react";
import { useCallback, useEffect, useState } from "react";
import { fetchGeoLocation, submitGeoLocation } from "src/api/apploan";
import { notifySuccess } from "src/utils/devExtremeUtils";
import { convertToDMS, copyToClipboard } from "src/utils/helpers";

const BusinessAddress = ({ appId, disabled = false }: { appId: string; disabled?: boolean }) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const isAvailable = center.lat !== 0 && center.lng !== 0;

  const [isShowPopupConfirm, setShowPopupConfirm] = useState(false);
  const [isLoadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    fetchGeoLocation(appId)
      .then((res) => {
        setCenter({
          lat: res.latitude,
          lng: res.longitude
        });
      })
      .catch((err) => {
        if (!disabled && err.message.includes("404")) {
          handleSubmitLocation();
        }
      });
  }, [appId, disabled]);

  const handleSubmitLocation = useCallback(
    (fromButton = false) => {
      setLoadingSave(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setCenter({ lat, lng });

            const payload = {
              latitude: lat,
              longitude: lng,
              mapUrl: `https://www.google.com/maps?q=${lat},${lng}`
            };

            submitGeoLocation(appId, payload).then(() => {
              setLoadingSave(false);
              setShowPopupConfirm(false);
              if (fromButton) {
                notifySuccess("Successfully updated the location");
              }
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

  const handleUpdateLocation = useCallback(() => {
    setShowPopupConfirm(true);
  }, []);

  const handleCancelUpdateLocation = useCallback(() => {
    setShowPopupConfirm(false);
  }, []);

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: 0 }}>
        <h3>Business Address</h3>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <strong>Geo Location:</strong>
        {isAvailable ? (
          <>
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

            <Button text="Update Location" visible={!disabled} onClick={handleUpdateLocation} />
          </>
        ) : (
          <p>Tidak tersedia</p>
        )}
      </div>

      <Popup width={360} height={"auto"} visible={isShowPopupConfirm} showTitle={false}>
        <div className="wrapper-popup-waiting">
          <h5 className="title">
            You are trying to change existing geoposition. Are you sure you want to do that?
          </h5>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button text="Cancel" onClick={handleCancelUpdateLocation} />
            <Button
              type="default"
              disabled={isLoadingSave}
              onClick={() => handleSubmitLocation(true)}
            >
              <div className="button-options">
                <LoadIndicator width="20px" height="20px" visible={isLoadingSave} />
                <span>Yes</span>
              </div>
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default BusinessAddress;
