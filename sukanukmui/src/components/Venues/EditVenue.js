import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import courtbanner from "../../images/court.jpg";
import "./AddVenue.css";
import MapModal from "./MapModal"; // Import the MapModal component

const EditVenue = () => {
  const navigate = useNavigate();
  const { CourtID } = useParams(); // Get CourtID from URL parameters
  const [isMapOpen, setIsMapOpen] = useState(false); // Modal state
  const [selectedLocation, setSelectedLocation] = useState({
    lat: null,
    lng: null,
  });
  const [direction, setDirection] = useState(""); // Direction input
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [courtName, setCourtName] = useState(""); // State for court name
  const [courtDescription, setCourtDescription] = useState(""); // State for court description
  const [courtData, setCourtData] = useState(null); // State to hold the existing court data
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchCourtData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courts/${CourtID}`);
        const result = await response.json();
  
        if (response.ok) {
          setCourtData(result);
          setCourtName(result.CourtName);
          setCourtDescription(result.CourtDescription);
          const location = result.CourtLocation.split(",");
          setSelectedLocation({ lat: parseFloat(location[0]), lng: parseFloat(location[1]) });
          setDirection(`https://www.google.com/maps?q=${location[0]},${location[1]}`);
          setImagePreview(`http://localhost:5000/images/${result.CourtPic}`);
        } else {
          setModalMessage(result.message || "Failed to fetch court data.");
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error fetching court data:", error);
        setModalMessage("An error occurred while fetching court data.");
        setShowModal(true);
      }
    };
  
    fetchCourtData();
  }, [CourtID]);  

  const handleMapOpen = () => setIsMapOpen(true);
  const handleMapClose = () => setIsMapOpen(false);
  const handleModalClose = () => {
    setShowModal(false);
    if (modalMessage === "Venue updated successfully!") {
      navigate(`/courts/${CourtID}`);
    }
  };
  

  const handleConfirmLocation = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setDirection(`https://www.google.com/maps?q=${lat},${lng}`);
    setIsMapOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };  

  const handleClearImage = () => setImagePreview(null);

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("CourtName", courtName);
    formData.append("CourtDescription", courtDescription);
    formData.append("latitude", selectedLocation.lat);
    formData.append("longitude", selectedLocation.lng);
    formData.append("CourtLocation", `${selectedLocation.lat},${selectedLocation.lng}`);

    // Append the actual file if selected
    const fileInput = document.querySelector("input[type='file']");
    if (fileInput && fileInput.files[0]) {
      formData.append("courtImage", fileInput.files[0]); // Append the actual file (not the preview URL)
    }

    try {
      const response = await fetch(`http://localhost:5000/api/courts/${CourtID}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
    
      if (response.ok) {
        setModalMessage("Venue updated successfully!");
        setShowModal(true);
      } else {
        setModalMessage(data.message || "Failed to update the venue.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage(`Error: ${error.message}`);
      setShowModal(true);
    }    
  };

  // Return loading state if courtData is still null
  if (!courtData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-venue" style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "20px", position: "relative", minHeight: "100vh" }}>
      {/* Header Banner */}
      <div className="header-banner" style={{ backgroundImage: `url(${courtbanner})`, borderRadius: "8px" }}>
        <h1 className="heading-1">Edit Venue</h1>
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
            <div style={{ fontSize: "14px", color: "#1f1d1d", fontFamily: "Arial, Helvetica, sans-serif" }}>
              <span>{CourtID}</span>
            </div>

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
            <span className="direction-icon" onClick={handleMapOpen} title="Select location on the map">
              📍
            </span>
          </div>
        </div>

        <button className="form-submit" onClick={handleSave}>Save</button>
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
      
      {showModal && (
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

export default EditVenue;
