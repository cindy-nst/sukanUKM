import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import equipmentBanner from "../../images/equipment.jpg"; // Updated variable name for clarity
import "./AddSportEquipment.css";

const AddSportEquipment = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [ItemID, setItemID] = useState(""); // Equipment ID state
  const [ItemName, setItemName] = useState(""); // State for equipment name
  const [ItemQuantity, setItemQuantity] = useState(""); // Quantity state
  const [SportPic, setSportPic] = useState(null); // Selected image state

  // Handle image file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSportPic(file); // Save the file to state
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image preview
  const handleClearImage = () => {
    setImagePreview(null); // Clear the image preview
    setSportPic(null); // Clear the selected file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("ItemID", ItemID);
    formData.append("ItemName", ItemName);
    formData.append("ItemQuantity", Number(ItemQuantity)); // Ensure it's a number

    if (SportPic) {
      formData.append("SportPic", SportPic); // Append image file
    }

    if (!ItemID || !ItemName || !ItemQuantity) {
        alert('Please fill in all fields');
        return;
      }      

    try {
      const response = await fetch("http://localhost:5000/api/add-equipment", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate("/sportequipment"); // Redirect to equipment list page
      } else {
        alert(result.message || "Failed to add equipment");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the equipment");
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
        {/* Upload Photo */}
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

        {/* Equipment ID */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            EQUIPMENT ID
          </label>
          <input
            className="form-input"
            type="text"
            value={ItemID}
            onChange={(e) => setItemID(e.target.value)} // Update state on change
            placeholder="Enter Equipment ID"
          />
        </div>

        {/* Equipment Name */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            NAME
          </label>
          <input
            className="form-input"
            type="text"
            value={ItemName}
            onChange={(e) => setItemName(e.target.value)} // Update state on change
            placeholder="Enter the equipment name"
          />
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: "bold", color: "black" }}>
            QUANTITY
          </label>
          <input
            className="form-input"
            type="number"
            value={ItemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)} // Update state on change
            placeholder="Enter the quantity"
          />
        </div>

        <button className="form-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddSportEquipment;
