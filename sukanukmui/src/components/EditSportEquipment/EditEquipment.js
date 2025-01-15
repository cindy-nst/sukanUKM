import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditEquipment.css';

const EditEquipment = () => {
  const navigate = useNavigate();
  const { ItemID } = useParams();
  console.log('Current ItemID from params:', ItemID);
  const [equipment, setEquipment] = useState({
    ItemName: '',
    ItemID: '',
    ItemQuantity: 0,
    SportPic: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const handleModalClose = () => {
    setShowModal(false);
    if (modalMessage === "Equipment updated successfully!") {
      navigate(`/equipment/details/${ItemID}`);
    }
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/sportequipment/${ItemID}`);
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setEquipment({
          ItemName: data.ItemName || '',
          ItemID: data.ItemID || '',
          ItemQuantity: data.ItemQuantity || 0,
          SportPic: data.SportPic || ''
        });

        if (data.SportPic) {
          setImagePreview(`http://localhost:5000/images/${data.SportPic}`);
        }
      } catch (error) {
        console.error('Error fetching equipment:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [ItemID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEquipment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Add the regular equipment data
      formData.append('ItemName', equipment.ItemName);
      formData.append('ItemQuantity', equipment.ItemQuantity);

      // If there's a new image file, append it
      if (imageFile) {
        formData.append('sportImage', imageFile);
      }

      console.log('Submitting update for ItemID:', ItemID);

      const response = await fetch(`http://localhost:5000/api/sportequipment/${ItemID}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update equipment');
      }

      const data = await response.json();
      console.log('Success:', data);
      setModalMessage('Equipment updated successfully!');
      setShowModal(true);

    } catch (error) {
      console.error('Error updating equipment:', error);
      setModalMessage(`Error: ${error.message}`);
      setShowModal(true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-equipment-container">
      <div className="edit-equipment-banner">
        <h1>Edit Equipment</h1>
      </div>

      <div className="edit-equipment-form-container">
        <form onSubmit={handleSubmit} className="edit-equipment-form">
          <div className="editequipmentimage-upload-section">
            <div className="editequipmentimage-preview">
              {imagePreview && (
                <img 
                  src={imagePreview}
                  alt={equipment.ItemName || "Equipment preview"}
                />
              )}
            </div>
            <div className="upload-button">
              <label htmlFor="editequipmentimage-upload" className="upload-label">
                Upload Photo
                <input
                  id="editequipmentimage-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden-input"
                />
              </label>
            </div>
            {imageFile && (
              <div className="file-name">
                {imageFile.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>NAME</label>
            <input
              type="text"
              name="ItemName"
              value={equipment.ItemName}
              onChange={handleInputChange}
              className="form-input"
              placeholder={equipment.ItemName}
            />
          </div>

          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              name="ItemID"
              value={equipment.ItemID}
              onChange={handleInputChange}
              className="form-input"
              readOnly
              placeholder={equipment.ItemID}
            />
          </div>

          <div className="form-group">
            <label>QUANTITY</label>
            <input
              type="number"
              name="ItemQuantity"
              value={equipment.ItemQuantity}
              onChange={handleInputChange}
              className="form-input"
              placeholder={equipment.ItemQuantity}
              min="0"
            />
          </div>

          <div className="court-actions">
          <button onClick={() => window.history.back()} className="back-button">
              Back
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="modal-backdrop-ee">
          <div className="modal-ee">
            <p>{modalMessage}</p>
            <button onClick={handleModalClose} className="close-button-ee">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEquipment;
