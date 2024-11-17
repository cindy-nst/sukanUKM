import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Send a request to the backend to reset the password
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Password successfully reset. You can now log in with the new password.');
        navigate('/login');
      } else {
        setErrorMessage(data.message || 'Password reset failed.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setErrorMessage('An error occurred while resetting your password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="logo-container">
          <h1 className="logo">
            SUKAN<span className="yellow">U</span>
            <span className="red">K</span>
            <span className="blue">M</span>
          </h1>
          <p className="subtitle">SPORTS BOOKING SYSTEM UKM</p>
        </div>

        <h2 className="page-title">Forgot Password</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-container">
              <span className="icon">
                <svg viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <span className="icon">
                <svg viewBox="0 0 20 20">
                  <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
                </svg>
              </span>
              <input
                type="password"
                name="newPassword"
                required
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <span className="icon">
                <svg viewBox="0 0 20 20">
                  <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
                </svg>
              </span>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
