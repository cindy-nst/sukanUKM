import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './BookEquipment.css'; // Assuming you have a corresponding CSS file for styling
import { useNavigate } from 'react-router-dom';

const BookEquipment = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        // Fetch list of equipment
        const response = await fetch('http://localhost:5000/api/sportequipment');
        if (!response.ok) {
          throw new Error('Failed to fetch equipment');
        }
        const equipmentList = await response.json();

        // Fetch availability for each item
        const equipmentWithAvailability = await Promise.all(
          equipmentList.map(async (item) => {
            const availabilityResponse = await fetch(
              `http://localhost:5000/api/availabilitysportequipment/${item.ItemID}`
            );
            if (!availabilityResponse.ok) {
              throw new Error('Failed to fetch availability');
            }
            const availabilityData = await availabilityResponse.json();
            return {
              ...item,
              AvailableQuantity: availabilityData.AvailableQuantity, // Add availability info
            };
          })
        );

        setEquipment(equipmentWithAvailability);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching equipment:', error.message);
        setIsLoading(false);
      }
    };

    fetchEquipment();
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

  if (isLoading) {
    return <div>Loading equipment...</div>;
  }

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
                <p className="equipment-quantity">
                  Availability: {item.AvailableQuantity}
                </p>
                <button
                  className={`book-now-button ${
                    item.AvailableQuantity <= 0 ? 'out-of-stock-button' : ''
                  }`}
                  onClick={() => handleBookNow(item.ItemID)}
                  disabled={item.AvailableQuantity <= 0} // Disable if no availability
                >
                  {item.AvailableQuantity > 0 ? 'Book Now' : 'Out of Stock'}
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