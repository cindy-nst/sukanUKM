import React, { useState, useEffect } from 'react';
import './styles.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [basicName, setBasicName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userID');

  useEffect(() => {
    if (!role || !userID) {
      setError('User not logged in');
      return;
    }

    console.log('Role:', role);
    console.log('UserID:', userID);

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getProfile/${role}/${userID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        console.log('Fetched profile data:', data);
        setProfile(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch basic name
    const fetchBasicName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getName/${role}/${userID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch name');
        }
        const data = await response.json();
        if (role === 'Student') {
          setBasicName(data.name);
        } else if (role === 'Staff') {
          setBasicName(data.name);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching name:', error);
      }
    };

    fetchBasicName();
    fetchProfile();
  }, [role, userID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="profile-container">
      <div className="main-content">
        <div className="profile-card">
          <div className="profile-info">
            <div
              className="profile-image"
              style={{
                backgroundImage: `url(/images/${profile.StudentPicture || profile.StaffPicture || 'default.png'})`,
              }}
            ></div>
            <div className="profile-details">
              <div className="profile-id">{profile.StudentID || profile.StaffID}</div>
              <div className="profile-name">{basicName}</div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Phone No.</span>
                  <span className="contact-value">{profile.StudentPhoneNumber || profile.StaffPhoneNumber}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">{profile.StudentEmail || profile.StaffEmail}</span>
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
