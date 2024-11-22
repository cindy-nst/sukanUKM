import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaSearch, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import './Venues.css';

const Venues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]); // State to store venues from the server
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  // Fetch venues from the backend on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/courts') // Backend endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }
        return response.json();
      })
      .then((data) => {
        setVenues(data); // Update state with the fetched data
      })
      .catch((error) => {
        console.error('Error fetching venues:', error.message);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter venues based on the search term
    const filteredVenues = venues.filter((venue) =>
      venue.CourtName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVenues(filteredVenues);
  };

  const handleSeeMore = () => {
    // Implement "See more" functionality, if applicable
  };

  const handleAddVenue = () => {
    // Implement "Add venue" functionality
    navigate("/add-venue");
  };

  return (
    <div className="venues-container">
      {/* Banner Section */}
      <div className="venues-banner">
        <h1>Manage Court</h1>
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

      {/* Featured Venues Section */}
      <div className="featured-venues">
        <h2>Featured Venues</h2>
        <div className="venues-grid">
          {venues.map((venue) => (
            <Link
              to={`/courts/${venue.CourtID}`} // Link to CourtDetail with CourtID
              key={venue.CourtID}
              className="venue-card"
            >
              <div className="venue-image">
                <img
                  src={`http://localhost:5000/images/${venue.CourtPic}`} // Serve images via backend
                  alt={venue.CourtName}
                />
              </div>
              <div className="venue-info">
                <h3 className="venue-name">{venue.CourtName}</h3>
                <a href={`https://maps.google.com?q=${venue.CourtLocation}`} className="map-link" onClick={(e) => e.stopPropagation()}>
                  <FaMapMarkerAlt />
                  <span>{venue.CourtLocation}</span>
                </a>
              </div>
            </Link>
          ))}
        </div>
        <button className="see-more-button" onClick={handleSeeMore}>
          See more venues
        </button>
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={handleAddVenue}>
        <FaPlus />
      </button>
    </div>
  );
};

export default Venues;
