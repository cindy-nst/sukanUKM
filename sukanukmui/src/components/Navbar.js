import React, { useState, useContext } from 'react'; // Add useContext
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { UserContext } from './UserContext'; // Add UserContext
import './Navbar.css';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { user, logout } = useContext(UserContext); // Add this
  const navigate = useNavigate(); // Add this

  // Add logout handler
  const handleLogout = () => {
    logout(); // Clear user data from context
    localStorage.removeItem('user'); // Clear user data from localStorage
    setIsProfileOpen(false); // Close the dropdown
    navigate('/'); // Navigate to login page
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

      <div className="menu-items">
        <Link to="/home">Explore</Link>
        <Link to="/venues">Venues</Link>
        <Link to="/equipments">Equipments</Link>
        <Link to="/report">Report</Link>
      </div>

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

        <div className="profile-section">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="profile-btn"
          >
            {user?.UserID} {/* Show actual username if available */}
          </button>
              {isProfileOpen && (
                <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setIsProfileOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;