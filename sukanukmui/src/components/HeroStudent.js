import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext'; // Adjust the path based on your project structure
import './HeroStudent.css'; // CSS file for styling the component

const HeroStudent = () => {
  const { user } = useContext(UserContext); // Access the user object from context
  const [userName, setUserName] = useState(''); // State to store the fetched name

  useEffect(() => {
    if (user && user.UserID && user.Role) {
      // Fetch the name dynamically based on role and UserID
      fetch(`http://localhost:5000/getName/${user.Role}/${user.UserID}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            setUserName(data.name); // Update state with the fetched name
          } else {
            setUserName('Unknown'); // Fallback if no name is found
          }
        })
        .catch((error) => {
          console.error('Error fetching user name:', error);
          setUserName('Error'); // Display error if the API call fails
        });
    }
  }, [user]);

  return (
    <div className="hero-student">
      <h1>WELCOME TO SUKAN UKM</h1>
      <h2>{userName || 'Loading...'}</h2>
    </div>
  );
};

export default HeroStudent;
