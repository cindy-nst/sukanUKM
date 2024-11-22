import React, { useState } from "react";
import courtbanner from "../../images/court.jpg";
import "./AddVenue.css";
import MapModal from "./MapModal"; // Import the MapModal component

const AddVenue = () => {
  const [isMapOpen, setIsMapOpen] = useState(false); // Modal state
  const [selectedLocation, setSelectedLocation] = useState({
    lat: null,
    lng: null,
  });
  const [direction, setDirection] = useState(""); // Direction input
  const [imagePreview, setImagePreview] = useState(null); // Image preview state

  const handleMapOpen = () => {
    setIsMapOpen(true);
  };

  const handleMapClose = () => {
    setIsMapOpen(false);
  };

  const handleConfirmLocation = () => {
    const { lat, lng } = selectedLocation;

    // Set Google Maps link as the direction
    if (lat && lng) {
      const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
      setDirection(mapLink);
    } else {
      setDirection(""); // Clear if no location is selected
    }

    setIsMapOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Set the preview to the file's data URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleClearImage = () => {
    setImagePreview(null); // Clear the image preview
  };

  return (
    <div className="add-court">
      {/* Header Banner */}
      <div
        className="header-banner"
        style={{ backgroundImage: `url(${courtbanner})` }}
      >
        <h1 className="heading-1">Add Venue</h1>
      </div>

      {/* Form */}
      <div className="form-container">
        <div className="form-group">
          <label className="form-label">NAME</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter the venue name"
          />
        </div>

        <div className="form-row">
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
          <div className="form-column">
            <label className="form-label">DESCRIPTION</label>
            <textarea
              className="form-input"
              placeholder="Enter what sport can be played on the venue"
            ></textarea>
          </div>
        </div>

        <div className="form-group">
        <br></br>
          <label className="form-label">DIRECTION</label>
          <div className="direction-input">
            <input
              className="form-input"
              type="text"
              value={direction}
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

        <button className="form-submit">Submit</button>
      </div>

      {/* Modal with Map */}
      {isMapOpen && (
        <MapModal
          setLocation={setSelectedLocation}
          onClose={handleMapClose}
          onConfirm={handleConfirmLocation} // Pass confirm handler to MapModal
        />
      )}
    </div>
  );
};

export default AddVenue;
