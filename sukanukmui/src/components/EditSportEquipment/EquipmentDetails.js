import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EquipmentDetails.css';

const EquipmentDetails = () => {
  const { ItemID } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Modal state
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const handlesetIsSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    if (modalMessage === "Equipment deleted successfully!") {
      navigate('/sportequipment'); // Navigate back to equipment list after deletion
    }
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sportequipment/${ItemID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [ItemID]);

  const handleEdit = () => {
    navigate(`/equipment/${ItemID}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sportequipment/${ItemID}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete equipment');
      }
      setModalMessage('Equipment deleted successfully!');
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error deleting equipment:', error);
      setModalMessage("An error occurred while deleting the equipment.");
      setIsSuccessModalOpen(true);
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!equipment) return <div>No equipment found</div>;

  return (
    <div className="equipment-details-container">
      {/* Header */}
      <header className="equipment-details-header">
        <h1>Equipment Details</h1>
      </header>

      <div className="equipment-details-content">
        {/* Image Section */}
        <div className="equipment-image-m">
          {equipment.SportPic && (
            <img
              src={`http://localhost:5000/images/${equipment.SportPic}`}
              alt={equipment.ItemName}
            />
          )}
        </div>

        {/* Details Section */}
        <div className="equipment-info">
          <h2>{equipment.ItemName}</h2>
          <p><strong>ID:</strong> {equipment.ItemID}</p>
          <p><strong>Quantity:</strong> {equipment.ItemQuantity}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="equipment-actions">
        <button className="edit-button" onClick={handleEdit}>Edit</button>
        <button className="delete-button" onClick={() => {setIsConfirmationModalOpen(true);}}>Delete</button>
      </div>
      {isConfirmationModalOpen && (
        <div className="modal-overlay-bh">
          <div className="modal-content-bh">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this equipment?</p>
            <div className="modal-buttons-bh">
              <button
                onClick={handleDelete}
                className="confirm-button-bh"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsConfirmationModalOpen(false)}
                className="close-modal-button-bh"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="modal-overlay-bh">
          <div className="modal-content-bh">
            <h2>Success</h2>
            <p>{modalMessage}</p>
            <div className="modal-buttons-bh">
              <button
                onClick={handlesetIsSuccessModalClose}
                className="okay-button-bh"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentDetails;
