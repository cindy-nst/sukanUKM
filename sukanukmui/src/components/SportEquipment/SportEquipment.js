import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaSearch, FaPlus } from 'react-icons/fa'; // Icons for search and add
import './SportEquipment.css'; // Assuming you have a corresponding CSS file for styling
import { useNavigate } from "react-router-dom";

const SportEquipment = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]); // State to store equipment data from the backend
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input

  useEffect(() => {
    fetch('http://localhost:5000/api/sportequipment') // Make sure this matches your backend API
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch equipment');
        }
        return response.json();
      })
      .then((data) => {
        setEquipment(data); // Store fetched data in state
      })
      .catch((error) => {
        console.error('Error fetching equipment:', error.message);
      });
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Filter equipment based on the search term
    const filteredEquipment = equipment.filter((item) =>
      item.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) // Assuming `ItemName` is a field in the equipment
    );
    setEquipment(filteredEquipment);
  };

  const handleSeeMore = () => {
    // Implement "See more" functionality if needed (e.g., pagination or loading more items)
  };

  const handleAddEquipment = () => {
    // Implement "Add equipment" functionality (e.g., navigate to a form to add new equipment)
    navigate("/add-sportequipment");
  };

  return (
    <div className="equipment-container">
      {/* Banner Section */}
      <div className="equipment-banner">
        <h1>Manage Equipment</h1>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search equipment"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Featured Equipment Section */}
      <div className="featured-equipment">
        <h2>Featured Equipment</h2>
        <div className="equipment-grid">
          {equipment.map((item) => (
            <Link
              to={`/equipment/details/${item.ItemID}`} // Link to equipment detail page with the equipment ID
              key={item.ItemID}
              className="equipment-card"
            >
              <div className="equipment-image">
                <img
                  src={`http://localhost:5000/images/${item.SportPic}`} // Assuming the equipment image is served from the backend
                  alt={item.ItemName}
                />
              </div>
              <div className="equipment-info">
                <h3 className="equipment-name">{item.ItemName}</h3>
                <p className="equipment-quantity">Quantity: {item.ItemQuantity}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={handleAddEquipment}>
        <FaPlus />
      </button>
    </div>
  );
};

export default SportEquipment;
