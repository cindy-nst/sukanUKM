import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import HomePage from '../HomePage/HomePage';
import Venues from '../Venues/Venues';

import './App.css';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/venues" element={<Venues />} />
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
}

export default App;