import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoibWhyYWZhZWwiLCJhIjoiY20zcG83ZDZiMGV0ejJrczgxaWJwN2g3YyJ9.wfWyzucTHcQkYjKJtjbVCw";

const MapModal = ({ mode, initialLocation, onClose, onConfirm }) => {
  const markerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  useEffect(() => {
    // Hardcoded default location (UKM)
    const defaultLocation = { lng: 101.78011063132253, lat: 2.929417297844372 };

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: mode === "select" ? [defaultLocation.lng, defaultLocation.lat] : 
              initialLocation ? [initialLocation.lng, initialLocation.lat] : 
              [defaultLocation.lng, defaultLocation.lat], // Fallback to default
      zoom: 13,
    });

    // Add a marker at the default or initial location
    if (mode === "select" || initialLocation) {
      markerRef.current = new mapboxgl.Marker()
        .setLngLat(mode === "select" ? [defaultLocation.lng, defaultLocation.lat] : 
                   [initialLocation.lng, initialLocation.lat])
        .addTo(map);
    }

    if (mode === "select") {
      // Allow the user to select a location on the map
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        console.log("Clicked location:", { lng, lat });

        // If there's an existing marker, remove it
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Add a new marker at the clicked location
        markerRef.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);

        setSelectedLocation({ lat, lng });
      });
    }

    // Cleanup the map on unmount
    return () => {
      map.remove();
    };
  }, [initialLocation, mode]);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation.lat, selectedLocation.lng);
    }
  };

  const handleOpenGoogleMap = () => {
    if (initialLocation) {
      const { lat, lng } = initialLocation;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(googleMapsUrl, "_blank");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === "view" ? "View Location" : "Select Location"}</h2>
        <div id="map" style={{ width: "100%", height: "400px" }}></div>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel">
            Close
          </button>
          {mode === "select" && (
            <button
              onClick={handleConfirmLocation}
              className="modal-button confirm"
              disabled={!selectedLocation}
            >
              Confirm Location
            </button>
          )}
          {mode === "view" && initialLocation && (
            <button onClick={handleOpenGoogleMap} className="modal-button confirm">
              Open in Google Maps
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapModal;
