// AddVenue.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import courtbanner from "../../images/court.jpg";
import "./AddVenue.css";
import MapModal from "./MapModal"; // Import the MapModal component

const AddVenue = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isMapOpen, setIsMapOpen] = useState(false); // Modal state
  const [selectedLocation, setSelectedLocation] = useState({
    lat: null,
    lng: null,
  });
  const [direction, setDirection] = useState(""); // Direction input
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [courtID, setCourtID] = useState(""); // Court ID state

  const handleMapOpen = () => {
    setIsMapOpen(true);
  };

  const handleMapClose = () => {
    setIsMapOpen(false);
  };

  const handleConfirmLocation = (lat, lng) => {
    // Update the selected location
    setSelectedLocation({ lat, lng });

    // Create a Google Maps link
    if (lat && lng) {
      const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
      setDirection(mapLink);
    } else {
      setDirection(""); // Clear if no location is selected
    }

    // Close the map modal
    setIsMapOpen(false);
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedImage(file); // Save the file to state
    const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Show preview
      };
    reader.readAsDataURL(file);
    }
  };

  
  const handleClearImage = () => {
    setImagePreview(null); // Clear the image preview
  };

  const handleCourtIDChange = (e) => {
    setCourtID(e.target.value); // Update court ID state
  };

  const [courtName, setCourtName] = useState(""); // State for court name
  const [courtDescription, setCourtDescription] = useState(""); // State for court description

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   
  
    const formData = new FormData();
    formData.append("CourtID", courtID);
    formData.append("CourtName", courtName);
    formData.append("CourtDescription", courtDescription);
    formData.append("latitude", selectedLocation.lat); // Append latitude
  formData.append("longitude", selectedLocation.lng); // Append longitude

  /// Save the lat,lng string to CourtLocation
  const locationString = `${selectedLocation.lat},${selectedLocation.lng}`;
  formData.append("CourtLocation", locationString); // Save lat,lng as string
    if (selectedImage) {
      formData.append("courtImage", selectedImage);
    }
  
  
    try {
      const response = await fetch('http://localhost:5000/api/add-court', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate("/venues");
      } else {
        alert(result.message || 'Failed to add court');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the court');
    }
  };
  

  return (
    <div className="add-venue"
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        position: "relative",
        minHeight: "100vh",
      }}>
      {/* Header Banner */}
      <div
        className="header-banner"
        style={{ backgroundImage: `url(${courtbanner})`,borderRadius: "8px",}}
      >
        <h1 className="heading-1">Add Venue</h1>
      </div>

      {/* Form */}
      <div className="form-container">
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            NAME
          </label>
          <input
            className="form-input"
            type="text"
            value={courtName} // Bind to courtName state
            onChange={(e) => setCourtName(e.target.value)} // Update state on change
            placeholder="Enter the venue name"
          />
        </div>

        <div className="form-row">
          {/* Upload Photo */}
          <div className="form-column">
            <label className="form-label">UPLOAD PHOTO</label>
            <div className="upload-box">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <div className="preview-controls">
                    <button className="clear-btn" onClick={handleClearImage}>
                      Remove
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="replace-input"
                    />
                  </div>
                </>
              ) : (
                <div className="upload-content">
                  <label className="upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="upload-input"
                    />
                    Upload from Computer
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* COURT ID and DESCRIPTION */}
          <div className="form-column">
            <label className="form-label">COURT ID</label> 
            <input
              className="form-input"
              type="text"
              value={courtID}
              onChange={handleCourtIDChange} // Handle Court ID change
              placeholder="Enter Court ID"
            />

            <label className="form-label" style={{ marginTop: "20px" }}>
              DESCRIPTION
            </label>
            <textarea
              className="form-input"
              value={courtDescription} // Bind to courtDescription state
              onChange={(e) => setCourtDescription(e.target.value)} // Update state on change
              placeholder="Enter what sport can be played on the venue"
            ></textarea>
          </div>
        </div>

        {/* Direction */}
        <div className="form-group">
          <br></br>
          <br></br>
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            DIRECTION
          </label>
          <div className="direction-input">
            <input
              className="form-input"
              type="text"
              value={direction || ""}
              readOnly
              placeholder="Click on the icon to select location"
            />
            <span
              className="direction-icon"
              onClick={handleMapOpen}
              title="Select location on the map"
            >
              📍
            </span>
          </div>
        </div>

        <button className="form-submit" onClick={handleSubmit}>Submit</button>
      </div>

      {/* Modal with Map */}
      {isMapOpen && (
        <MapModal
          mode="select" // Set mode to select for selecting a new location
          initialLocation={selectedLocation}
          onClose={handleMapClose}
          onConfirm={(lat, lng) => handleConfirmLocation(lat, lng)} // Pass confirm handler
        />
      )}
    </div>
  );
};

export default AddVenue;
