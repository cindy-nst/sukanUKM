import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext'; // Adjust the path if necessary
import './Hero.css'; // Use a single CSS file or adjust paths as needed

const Hero = () => {
  const { user } = useContext(UserContext); // Access user from context
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user && user.UserID && user.Role) {
      // API call to fetch user name based on role and UserID
      fetch(`http://localhost:5000/getName/${user.Role}/${user.UserID}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            setUserName(data.name);
          } else {
            setUserName('Unknown'); // Fallback if no name is found
          }
        })
        .catch((error) => {
          console.error('Error fetching user name:', error);
          setUserName('Error'); // Display error message if API fails
        });
    }
  }, [user]);

  return (
    <div className="hero">
      <h1>WELCOME TO SUKAN UKM</h1>
      <h2>{userName || 'Loading...'}</h2>
    </div>
  );
};

export default Hero;
