import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import './BookCourt.css';


const Venues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null, name: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/courts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }
        return response.json();
      })
      .then((data) => {
        setVenues(data);
        setFilteredVenues(data);
      })
      .catch((error) => {
        console.error('Error fetching venues:', error.message);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = venues.filter((venue) =>
      venue.CourtName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVenues(filtered);
  };

  const handleSeeMore = () => {
    setFilteredVenues(venues);
  };

  const handleAddVenue = () => {
    navigate("/add-venue");
  };

  const handleBookNow = (e, venueId) => {
    e.preventDefault();
    // Add your booking logic here
    navigate(`/book/${venueId}`);
  };

  return (
    <div className="venues-container">
      <div className="venues-banner">
        <h1>Book to Play</h1>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search venue name"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
      </div>

      <div className="featured-venues">
        <h2>Featured Venues</h2>
        <div className="venues-grid">
          {filteredVenues.length === 0 ? (
            <p>No venues found</p>
          ) : (
            filteredVenues.map((venue) => (
              <div key={venue.CourtID} className="venue-card">
                <div className="venue-image">
                  <img
                    src={`http://localhost:5000/images/${venue.CourtPic}`}
                    alt={venue.CourtName}
                  />
                </div>
                <div className="venue-info">
                  <h3 className="venue-name">{venue.CourtName}</h3>
                  <button
                    className="book-now-button"
                    onClick={(e) => handleBookNow(e, venue.CourtID)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Venues;