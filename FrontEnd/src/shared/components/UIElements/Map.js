import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";  // Import Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png"; 
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix the marker issue by defining a custom icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],  // Default size
  iconAnchor: [12, 41], // Adjusts where the marker sits on the map
  popupAnchor: [1, -34], // Adjusts where the popup appears
});

const Map = ({ center, zoom }) => {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* <TileLayer> component in React Leaflet is used to display map tiles(small square image of a larger view of map) from an external tile provider (e.g., OpenStreetMap, Google Maps, Mapbox). It loads small images (tiles) dynamically based on zoom level and location.

      s is subdomain and helps to load maptiles faster distributes loads in diff servers when required 
      z zoom leve;
      x means horizontal coordinates
      y means vertical coordinates*/}
      <Marker position={[center.lat, center.lng]} icon={customIcon}>
        <Popup>This is the selected location.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
