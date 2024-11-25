import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EquipmentDetails.css';

const EquipmentDetails = () => {
  const { ItemID } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const confirmDelete = window.confirm('Are you sure you want to delete this equipment?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/sportequipment/${ItemID}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete equipment');
        }
        alert('Equipment deleted successfully!');
        navigate('/sportequipment'); // Navigate back to equipment list after deletion
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Failed to delete equipment. Please try again.');
      }
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
        <div className="equipment-image">
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
        <button className="delete-button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default EquipmentDetails;
