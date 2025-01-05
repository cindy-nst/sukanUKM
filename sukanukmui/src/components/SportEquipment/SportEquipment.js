import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import './SportEquipment.css';
import { useNavigate } from "react-router-dom";

const SportEquipment = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]); // New state for filtered results
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/sportequipment')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch equipment');
        }
        return response.json();
      })
      .then((data) => {
        setEquipment(data);
        setFilteredEquipment(data); // Initialize filtered equipment with all equipment
      })
      .catch((error) => {
        console.error('Error fetching equipment:', error.message);
      });
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = equipment.filter((item) =>
      item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipment(filtered); // Update filtered results instead of original equipment
  };

  const handleSeeMore = () => {
    // Implement "See more" functionality if needed
  };

  const handleAddEquipment = () => {
    navigate("/add-sportequipment");
  };

  return (
    <div className="equipment-container">
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

      <div className="featured-equipment">
        <h2>Featured Equipment</h2>
        <div className="equipment-grid">
          {filteredEquipment.length === 0 ? (
            <p>No equipment found</p>
          ) : (
            filteredEquipment.map((item) => (
              <Link
                to={`/equipment/details/${item.ItemID}`}
                key={item.ItemID}
                className="equipment-card"
              >
                <div className="equipment-image">
                  <img
                    src={`http://localhost:5000/images/${item.SportPic}`}
                    alt={item.ItemName}
                  />
                </div>
                <div className="equipment-info">
                  <h3 className="equipment-name">{item.ItemName}</h3>
                  <p className="equipment-quantity">Quantity: {item.ItemQuantity}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <button className="fab" onClick={handleAddEquipment}>
        <FaPlus />
      </button>
    </div>
  );
};

export default SportEquipment;