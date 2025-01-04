import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login, logout } = useContext(UserContext);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    logout();
  }, [logout]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    // Check for password length
    if (credentials.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const userData = {
          ...data.user,
          role: data.role,
          details: data.details,
        };
  
        login(userData);
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login');
    }
  };
  

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <h1 className="logo">
            SUKAN<span className="yellow">U</span>
            <span className="red">K</span>
            <span className="blue">M</span>
          </h1>
          <p className="subtitle">SPORTS BOOKING SYSTEM UKM</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message-login">{error}</div>}
          
          <div className="input-group">
            <div className="input-container">
              <span className="icon">
                <svg viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </span>
              <input
                type="text"
                name="username"
                required
                placeholder="Username"
                value={credentials.username}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <span className="icon">
                <svg viewBox="0 0 20 20">
                  <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                </svg>
              </span>
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password"
          >
            &lt;&lt; Forgot Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
