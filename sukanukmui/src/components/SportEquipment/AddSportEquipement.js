import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import equipmentBanner from "../../images/equipment.jpg";
import "./AddSportEquipment.css";

const AddSportEquipment = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [ItemID, setItemID] = useState("");
  const [ItemName, setItemName] = useState("");
  const [ItemQuantity, setItemQuantity] = useState("");
  const [SportPic, setSportPic] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false); // Track if submission was successful

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSportPic(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setSportPic(null);
  };

  const handleModalClose = () => {
    setIsMessageModalOpen(false);
    setModalMessage("");
    if (isSuccessful) {
      navigate("/sportequipment"); // Navigate only if the submission was successful
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ItemID || !ItemName || !ItemQuantity) {
      setModalMessage("Please fill in all fields");
      setIsMessageModalOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("ItemID", ItemID);
    formData.append("ItemName", ItemName);
    formData.append("ItemQuantity", Number(ItemQuantity));

    if (SportPic) {
      formData.append("SportPic", SportPic);
    }

    try {
      const response = await fetch("http://localhost:5000/api/add-equipment", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setModalMessage(result.message);
        setIsSuccessful(true); // Mark submission as successful
        setIsMessageModalOpen(true);
      } else {
        setModalMessage(result.message || "Failed to add equipment");
        setIsSuccessful(false); // Mark submission as unsuccessful
        setIsMessageModalOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("An error occurred while adding the equipment");
      setIsSuccessful(false); // Mark submission as unsuccessful
      setIsMessageModalOpen(true);
    }
  };

  return (
    <div
      className="add-item"
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
        style={{
          backgroundImage: `url(${equipmentBanner})`,
          borderRadius: "8px",
        }}
      >
        <h1 className="heading-1">Add Sport Equipment</h1>
      </div>

      {/* Form */}
      <div className="form-container">
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            UPLOAD PHOTO
          </label>
          <div className="upload-box">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <div
                  className="preview-controls"
                  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                  <button className="clear-btn" onClick={handleClearImage}>
                    Remove
                  </button>
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

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            EQUIPMENT ID
          </label>
          <input
            className="form-input"
            type="text"
            value={ItemID}
            onChange={(e) => setItemID(e.target.value)}
            placeholder="Enter Equipment ID"
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            NAME
          </label>
          <input
            className="form-input"
            type="text"
            value={ItemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter the equipment name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            QUANTITY
          </label>
          <input
            className="form-input"
            type="number"
            value={ItemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            placeholder="Enter the quantity"
          />
        </div>

        <button className="form-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>

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

export default AddSportEquipment;
