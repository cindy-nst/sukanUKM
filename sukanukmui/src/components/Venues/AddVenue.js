import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import courtbanner from "../../images/court.jpg";
import "./AddVenue.css";
import MapModal from "./MapModal"; // Import the MapModal component

const AddVenue = () => {
  const navigate = useNavigate();
  const [isMapOpen, setIsMapOpen] = useState(false); // Map modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // Message modal state
  const [modalMessage, setModalMessage] = useState(""); // Message to display in the modal
  const [selectedLocation, setSelectedLocation] = useState({
    lat: null,
    lng: null,
  });
  const [direction, setDirection] = useState(""); // Direction input
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [courtID, setCourtID] = useState(""); // Court ID state
  const [selectedImage, setSelectedImage] = useState(null); // File input state
  const [courtName, setCourtName] = useState(""); // State for court name
  const [courtDescription, setCourtDescription] = useState(""); // State for court description

  const handleMapOpen = () => {
    setIsMapOpen(true);
  };

  const handleMapClose = () => {
    setIsMapOpen(false);
  };

  const handleConfirmLocation = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
    setDirection(mapLink);
    setIsMapOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
  };

  const handleCourtIDChange = (e) => {
    setCourtID(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("CourtID", courtID);
    formData.append("CourtName", courtName);
    formData.append("CourtDescription", courtDescription);
    formData.append("latitude", selectedLocation.lat);
    formData.append("longitude", selectedLocation.lng);
    formData.append("CourtLocation", `${selectedLocation.lat},${selectedLocation.lng}`);
    if (selectedImage) {
      formData.append("courtImage", selectedImage);
    }

    try {
      const response = await fetch("http://localhost:5000/api/add-court", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setModalMessage("Venue added successfully!");
        setIsMessageModalOpen(true);
      } else {
        setModalMessage(result.message || "Failed to add court");
        setIsMessageModalOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("An error occurred while adding the court");
      setIsMessageModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsMessageModalOpen(false);
    if (modalMessage === "Venue added successfully!") {
      navigate("/venues");
    }
  };

  return (
    <div
      className="add-venue"
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* Header Banner */}
      <div
        className="header-banner"
        style={{ backgroundImage: `url(${courtbanner})`, borderRadius: "8px" }}
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
            value={courtName}
            onChange={(e) => setCourtName(e.target.value)}
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
              onChange={handleCourtIDChange}
              placeholder="Enter Court ID"
            />

            <label className="form-label" style={{ marginTop: "20px" }}>
              DESCRIPTION
            </label>
            <textarea
              className="form-input"
              value={courtDescription}
              onChange={(e) => setCourtDescription(e.target.value)}
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

        <button className="form-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Modal with Map */}
      {isMapOpen && (
        <MapModal
          mode="select"
          initialLocation={selectedLocation}
          onClose={handleMapClose}
          onConfirm={(lat, lng) => handleConfirmLocation(lat, lng)}
        />
      )}

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="modal-backdrop-ee">
          <div className="modal-ee">
            <p>{modalMessage}</p>
            <button onClick={handleModalClose} className="close-button-ee">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVenue;
