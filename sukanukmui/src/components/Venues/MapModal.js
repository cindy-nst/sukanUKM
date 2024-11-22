import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl"; // Import Mapbox library
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox styles

// Set the access token directly
mapboxgl.accessToken = "pk.eyJ1IjoibWhyYWZhZWwiLCJhIjoiY20zcG83ZDZiMGV0ejJrczgxaWJwN2g3YyJ9.wfWyzucTHcQkYjKJtjbVCw";

const MapModal = ({ setLocation, onClose, onConfirm }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [101.7775, 2.9274],
      zoom: 13,
    });

    let marker;

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      if (marker) {
        marker.setLngLat([lng, lat]);
      } else {
        marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      }

      setLocation({ lat, lng });
    });

    return () => map.remove();
  }, [setLocation]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Location</h2>
        <div id="map" style={{ width: "100%", height: "400px" }}></div>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-button confirm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;