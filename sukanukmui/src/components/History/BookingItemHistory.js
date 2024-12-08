import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingItemHistory.css';
import { UserContext } from '../UserContext';

const BookingItemHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]); // Initial state is an empty array
  const [error, setError] = useState(null); // For error handling

  // Fetch bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getBookingItemHistory?UserID=${user.UserID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();

        if (data.length === 0) {
          // If no bookings found, clear any previous error and display the "no bookings" message
          setBookings([]);
        } else {
          setBookings(data); // Update state with the fetched bookings
        }
      } catch (err) {
        setError(err.message); // Handle any errors
      }
    };
  
    fetchBookings();
  }, [user.UserID]); // Include user.UserID as a dependency

  const handleViewDetails = (booking) => {
    // Navigate to the HistoryDetails page and pass the booking details
    navigate(`/booking-item-detail/${booking.BookingItemID}`);
  };

  // Function to format date to dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="booking-history-container">
      <div className="booking-history-banner">
        <h1>Booking History</h1>
      </div>
  
      <div className="booking-history-list">
        <h2>Your Booking History List</h2>
        <div className="bookings-grid">
          {error ? (
            <p className="error">{error}</p>
          ) : bookings.length === 0 ? (
            <p>You have not booked any item</p> // Display message for empty bookings
          ) : (
            bookings.map((booking) => (
              <div key={booking.BookingItemID} className="booking-card">
                <div className="booking-image">
                  <img
                    src={`http://localhost:5000/images/${booking.SportPic}`}
                    alt={booking.ItemName}
                  />
                </div>
                <div className="booking-info">
                  <h3 className="booking-title">{booking.ItemName}</h3>
                  <p className="booking-date">
                    <span style={{ fontWeight: 'bold' }}>Booking Date: </span>{formatDate(booking.BookingItemDate)}<br />
                    <span style={{ fontWeight: 'bold' }}>Return Date: </span>{formatDate(booking.BookingItemReturnedDate)}
                  </p>
                  <button
                    className="view-button"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingItemHistory;