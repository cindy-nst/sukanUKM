import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './BookEquipment.css'; // Assuming you have a corresponding CSS file for styling
import { useNavigate } from 'react-router-dom';

const BookEquipment = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
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
      })
      .catch((error) => {
        console.error('Error fetching equipment:', error.message);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredEquipment = equipment.filter((item) =>
      item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setEquipment(filteredEquipment);
  };

  const handleSeeMore = () => {
    // Implement "See more" functionality if needed (e.g., pagination or loading more items)
  };

  const handleBookNow = (itemId) => {
    // Implement "Book Now" functionality (e.g., navigate to a booking form with the selected equipment ID)
    navigate(`/book-equipment/${itemId}`);
  };

  return (
    <div className="equipment-container">
      <div className="equipment-banner">
        <h1>Book Sport Equipment</h1>
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
          {equipment.map((item) => (
            <div key={item.ItemID} className="equipment-card">
              <div className="equipment-image">
                <img
                  src={`http://localhost:5000/images/${item.SportPic}`}
                  alt={item.ItemName}
                />
              </div>
              <div className="equipment-info">
                <h3 className="equipment-name">{item.ItemName}</h3>
                <p className="equipment-quantity">Availability: {item.ItemQuantity}</p>
                <button
                  className="book-now-button"
                  onClick={() => handleBookNow(item.ItemID)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="see-more-button" onClick={handleSeeMore}>
          See more equipment
        </button>
      </div>
    </div>
  );
};

export default BookEquipment;