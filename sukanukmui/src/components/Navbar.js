import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Navbar.css';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const getVenueLink = () => {
    return user?.role === 'Student' ? 
      <Link to="/book-court">Book Court</Link> : 
      <Link to="/venues">Venues</Link>;
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

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
        {user && (
          <div className="profile-section" ref={profileRef}>
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
