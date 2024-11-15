// UKMSportDepartmentProfile.js
import React from 'react';
import rafa from '../../images/rafa.jpg';
import './styles.css'; // Import the CSS file

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="main-content">
        <div className="profile-card">
          <div className="profile-info">
          <div className="profile-image" style={{ backgroundImage: `url(${rafa})` }}></div>
            <div className="profile-details">
            <div className="profile-id">(S01001)</div>
              <div className="profile-name">Muhammad Fakhrul bin Raziman</div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Phone No.</span>
                  <span className="contact-value">0176543890</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">fakhrul@ukm.my</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
