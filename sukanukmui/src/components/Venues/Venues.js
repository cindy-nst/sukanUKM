import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaSearch, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import './Venues.css';
import MapModal from './MapModal'; // Import the MapModal component

const Venues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]); // State to store venues from the server
  const [filteredVenues, setFilteredVenues] = useState([]); // State to store filtered venues
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [locationNames, setLocationNames] = useState({}); // Object to store location names for each venue
  const [isMapOpen, setIsMapOpen] = useState(false); // State for showing the MapModal
  const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null, name: '' }); // Store selected location

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
        setFilteredVenues(data); // Set filteredVenues to initial list
        data.forEach((venue) => {
          // For each venue, fetch the location name from the coordinates
          if (venue.CourtLocation) {
            const [lat, lng] = venue.CourtLocation.split(',').map(Number);
            fetchLocationName(lat, lng, venue.CourtID);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching venues:', error.message);
      });
  }, []);

  const fetchLocationName = (lat, lng, venueId) => {
    const accessToken = "pk.eyJ1IjoibWhyYWZhZWwiLCJhIjoiY20zcG83ZDZiMGV0ejJrczgxaWJwN2g3YyJ9.wfWyzucTHcQkYjKJtjbVCw";
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const locationName = data.features[0].place_name; // Get the location name
          setLocationNames((prevNames) => ({
            ...prevNames,
            [venueId]: locationName, // Store location name in the state
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching location name:", error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter venues based on the search term
    const filtered = venues.filter((venue) =>
      venue.CourtName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVenues(filtered); // Update filtered venues
  };

  const handleSeeMore = () => {
    // Implement "See more" functionality, like pagination or show all
    setFilteredVenues(venues); // Show all venues when clicking "See more"
  };

  const handleAddVenue = () => {
    // Navigate to the "Add Venue" page
    navigate("/add-venue");
  };

  const handleOpenMapModal = (venue) => {
    const [lat, lng] = venue.CourtLocation.split(',').map(Number);
    const locationName = locationNames[venue.CourtID] || venue.CourtLocation; // Get location name or fallback to coordinates
    setSelectedLocation({ lat, lng, name: locationName });
    setIsMapOpen(true); // Open the map modal
  };
  
  const handleLocationConfirm = (newLocation) => {
    // If the venue already exists, update it, otherwise create a new one
    setVenues((prev) =>
      prev.map((venue) =>
        venue.CourtID === selectedLocation.id
          ? { ...venue, CourtLocation: `${newLocation.lat},${newLocation.lng}` }
          : venue
      )
    );
    setIsMapOpen(false); // Close the map modal after confirming
  };

  const handleCloseMapModal = () => {
    setIsMapOpen(false); // Close the map modal
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
          {filteredVenues.length === 0 ? (
            <p>No venues found</p>
          ) : (
            filteredVenues.map((venue) => (
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
                  <div
                     className="map-link"
                      onClick={(e) => {
                        e.preventDefault();
                         handleOpenMapModal(venue);
                      }}
                  >
                     <FaMapMarkerAlt />
                       <span>{locationNames[venue.CourtID] || venue.CourtLocation}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <button className="see-more-button" onClick={handleSeeMore}>
          See more venues
        </button>
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={handleAddVenue}>
        <FaPlus />
      </button>

      {/* Map Modal */}
      {isMapOpen && selectedLocation.lat && selectedLocation.lng && (
        <MapModal
          mode="view"
          locationName={selectedLocation.name}
          initialLocation={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          onClose={handleCloseMapModal}
          
        />
      )}

      
    </div>
  );
};

export default Venues;
