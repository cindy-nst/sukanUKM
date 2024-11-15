// Venues.js
import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import court from '../../images/court.jpg';
import futsalCourt from '../../images/KPZFutsalCourt.jpg';
import SerbagunaCourt from '../../images/GelanggangSerbagunaUKM.jpg';
import TennisCourt from '../../images/TennisCourtUKM.jpg';
import StadiumUKM from '../../images/StadiumUKM.jpg';
import SquashComplex from '../../images/SquashComplex.jpg';
import './Venues.css';
//import Layout from '../Layout';

const Venues = () => {
  const [venues] = useState([
    {
      id: 1,
      name: 'KPZ Futsal Court',
      image: futsalCourt,
      sports: ['FUTSAL', 'FRISBEE', 'HANDBALL', 'DODGEBALL'],
      mapUrl: 'https://maps.app.goo.gl/tjU1LRnwYFoZcZz9'
    },
    {
      id: 2,
      name: 'KKM Badminton Hall',
      image: court,
      sports: ['BADMINTON'],
      mapUrl: 'https://maps.app.goo.gl/tjU1LRnwYFoZcZz9'
    },
    {
      id: 3,
      name: 'Gelanggang Serbaguna UKM (Outdoor)',
      image: SerbagunaCourt,
      sports: ['HANDBALL', 'HOCKEY', 'FUTSAL', 'DODGEBALL'],
      mapUrl: 'https://maps.app.goo.gl/tjU1LRnwYFoZcZz9'
    },
    {
      id: 4,
      name: 'Tennis Court UKM',
      image: TennisCourt,
      sports: ['TENNIS'],
      mapUrl: 'https://maps.app.goo.gl/tjU1LRnwYFoZcZz9'
    },
    {
      id: 5,
      name: 'Stadium UKM',
      image: StadiumUKM,
      sports: ['TRACK & FIELD', 'FOOTBALL'],
      mapUrl: 'https://maps.app.goo.gl/tjU1LRnwYFoZcZz9'
    },
    {
      id: 6,
      name: 'Squash Complex',
      image: SquashComplex,
      sports: ['SQUASH'],
      mapUrl: 'https://maps.app.goo.gl/tjU1LRnwYFoZcZz9'
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  const handleSeeMore = () => {
    // Implement see more functionality
  };

  const handleAddVenue = () => {
    // Implement add venue functionality
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
            <div key={venue.id} className="venue-card">
              <div className="venue-image">
                <img src={venue.image} alt={venue.name} />
              </div>
              <div className="venue-info">
                <div className="sports-categories">
                  {venue.sports.join(', ')}
                </div>
                <h3 className="venue-name">{venue.name}</h3>
                <a href={venue.mapUrl} className="map-link">
                  <FaMapMarkerAlt />
                  <span>{venue.mapUrl}</span>
                </a>
              </div>
            </div>
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