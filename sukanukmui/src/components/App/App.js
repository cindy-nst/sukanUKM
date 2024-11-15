import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import HomePage from '../HomePage/HomePage';
import Venues from '../Venues/Venues';
import Profile from '../Profile/Profile';
import Navbar from '../Navbar';
import { UserContext } from '../UserContext'; // Assuming this is where your UserContext is defined

import './App.css';

function App() {
  const { user } = useContext(UserContext); // Access user data from context

  return (
    <div className="App">
      {/* Render Navbar only if the user is logged in */}
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
