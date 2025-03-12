import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsLocation = ({ center }: { center: { lat: number; lng: number } }) => {
  const containerStyle = {
    width: "100%",
    height: "250px"
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={{ disableDoubleClickZoom: false, draggable: false, scrollwheel: true }}
    >
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};

export default GoogleMapsLocation;
