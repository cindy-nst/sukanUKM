import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Navbar.css';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  // Function to determine the appropriate venue-related link based on user role
  const getVenueLink = () => {
    return user?.role === 'Student' ? 
      <Link to="/book-court">Book Court</Link> : 
      <Link to="/venues">Venues</Link>;
  };

  // Function to determine the appropriate equipment-related link based on user role
  const getEquipmentLink = () => {
    return user?.role === 'Student' ? 
      <Link to="/book-equipment">Book Equipment</Link> :
      <Link to="/sportequipment">Equipments</Link>;
  };
  
  const getReportLink = () => {
    return user?.role === 'Student' ?
    <Link to="/historypage">History</Link> :
    <Link to="/report">Report</Link>;
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <h1 className="logo">
          SUKAN<span className="yellow">U</span>
          <span className="red">K</span>
          <span className="blue">M</span>
        </h1>
        <span className="tagline">Sports Booking System UKM</span>
      </div>
      
      {user && (
        <div className="menu-items">
          <Link to="/home">Explore</Link>
          {getVenueLink()}
          {getEquipmentLink()}
          {getReportLink()}
        </div>
      )}

      <div className="nav-controls">
        <div className="language-switcher">
          <button 
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="lang-btn"
          >
            EN
          </button>
          {isLanguageOpen && (
            <div className="dropdown-menu">
              <button onClick={() => console.log('Switch to English')}>English</button>
              <button onClick={() => console.log('Switch to Malay')}>Bahasa Melayu</button>
            </div>
          )}
        </div>

        <Link to="/help" className="help-btn">Help</Link>

        {user && (
          <div className="profile-section">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="profile-btn"
            >
              {user.UserID}
            </button>
            {isProfileOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setIsProfileOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
