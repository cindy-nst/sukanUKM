import React, { useState, useEffect, useContext } from 'react';
import './styles.css';
import { UserContext } from '../UserContext';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile?userId=${user.UserID}&role=${user.Role}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData(data.profile);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.UserID && user.Role) {
      console.log("Fetching profile with:", user.UserID, user.Role); // Debug UserContext values
      fetchProfile();
    }
  }, [user]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;

  const picturePath =
    profileData?.[user.Role === 'Student' ? 'StudentPicture' : 'StaffPicture']
      ? require(`../../images/${profileData[user.Role === 'Student' ? 'StudentPicture' : 'StaffPicture']}`)
      : require('../../images/rafa.jpg');

  return (
    <div className="profile-container">
      <div className="main-content">
        <div className="profile-card">
          <div className="profile-info">
            <div
              className="profile-image"
              style={{
                backgroundImage: `url(${picturePath})`,
              }}
            ></div>
            <div className="profile-details">
              <div className="profile-id">({profileData?.[user.Role === 'Student' ? 'StudentID' : 'StaffID']})</div>
              <div className="profile-name">
                {profileData?.[user.Role === 'Student' ? 'StudentName' : 'StaffName']}
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Phone No.</span>
                  <span className="contact-value">
                    {profileData?.[user.Role === 'Student' ? 'StudentPhoneNumber' : 'StaffPhoneNumber']}
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">
                    {profileData?.[user.Role === 'Student' ? 'StudentEmail' : 'StaffEmail']}
                  </span>
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