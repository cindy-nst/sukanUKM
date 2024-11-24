import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import courtbanner from "../../images/court.jpg"; // You can change this if you have a different image for CourtDetail
import "./CourtDetail.css";
import MapModal from "./MapModal";

const CourtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [locationName, setLocationName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Court not found.");
        }
        return response.json(); 
      })
      .then((data) => {
        setCourt(data);
        setLoading(false);

        const locationCoordinates = data.CourtLocation
          ? data.CourtLocation.split(",").map(Number)
          : null;

        if (locationCoordinates && locationCoordinates.length === 2) {
          fetchLocationName(locationCoordinates[0], locationCoordinates[1]);
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const fetchLocationName = (lat, lng) => {
    const accessToken = "pk.eyJ1IjoibWhyYWZhZWwiLCJhIjoiY20zcG83ZDZiMGV0ejJrczgxaWJwN2g3YyJ9.wfWyzucTHcQkYjKJtjbVCw";
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const name = data.features[0].place_name;
          setLocationName(name);
        }
      })
      .catch((error) => {
        console.error("Error fetching location name:", error);
        setLocationName("Location not found");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  if (!court) {
    return <div>Court not found.</div>;
  }

  const locationCoordinates = court.CourtLocation
    ? court.CourtLocation.split(",").map(Number)
    : null;

  const initialLocation =
    locationCoordinates && locationCoordinates.length === 2
      ? { lat: locationCoordinates[0], lng: locationCoordinates[1] }
      : null;

  const handleOpenMap = () => {
    setIsMapOpen(true); // Open MapModal first in "view" mode
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
  };

  const handleConfirmLocation = (lat, lng) => {
    // Once a location is clicked in MapModal, open Google Maps
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank"); // Open Google Maps with the coordinates
    setIsMapOpen(false); // Close the map modal after confirming
  };

  const handleEdit = () => {
    // Handle Edit logic here
    alert("Edit button clicked!");
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this court?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/courts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Court deleted successfully.");
        navigate("/venues"); // Redirect to the venues page
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete court.");
      }
    } catch (error) {
      console.error("Error deleting court:", error);
      alert("An error occurred while deleting the court.");
    }
  };


  return (
    <div className="add-court">
      {/* Header Banner */}
      <div
        className="header-banner"
        style={{ backgroundImage: `url(${courtbanner})` }}
      >
        <h1 className="heading-1">Venue Details</h1>
      </div>

      {/* Court Details Container */}
      <div className="form-container">
        <div className="form-group">
          <label className="form-label">NAME</label>
          <p>{court.CourtName}</p>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label className="form-label">PHOTO</label>
            <div className="upload-box">
              <img
                src={`http://localhost:5000/images/${court.CourtPic}`}
                alt={court.CourtName}
                className="image-preview"
              />
            </div>
          </div>
          

          <div className="form-column" style={{ marginTop: "20px" }}>
          <label className="form-label">COURT ID</label>
          <p>{court.CourtID}</p>
          <br></br>
            <label className="form-label">DESCRIPTION</label>
            <p>{court.CourtDescription}</p>
          </div>
        </div>

        <div className="form-group">
          <br />
          <label className="form-label">DIRECTION</label>
          <div className="direction-input">
            <input
              className="form-input"
              type="text"
              value={locationName || "Fetching location..."}
              readOnly
              placeholder="Location name"
            />
            <span
              className="direction-icon"
              onClick={handleOpenMap} // Open the map modal first
              title="View location on map"
            >
              📍
            </span>
          </div>
        </div>

        {/* Edit and Delete Buttons Inside the Form Container */}
        <div className="court-actions">
          <button onClick={handleEdit} className="edit-btn">
            Edit
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      </div>

      {/* Modal with Map */}
      {isMapOpen && initialLocation && (
        <MapModal
          mode="view" // Set mode to select for selecting a new location
          initialLocation={initialLocation}
          onClose={handleCloseMap}
          onConfirm={handleConfirmLocation} // Pass onConfirm to get the location on click
        />
      )}
    </div>
  );
};

export default CourtDetail;
