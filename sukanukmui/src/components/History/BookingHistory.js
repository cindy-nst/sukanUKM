import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingHistory.css';
import { UserContext } from '../UserContext';

const BookingHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]); // Initial state is an empty array
  const [error, setError] = useState(null); // For error handling

  // Fetch bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getBookingHistory?UserID=${user.UserID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data); // Update state with the fetched bookings
      } catch (err) {
        setError(err.message); // Handle any errors
      }
    };
  
    fetchBookings();
  }, [user.UserID]); // Include user.UserID as a dependency

  const handleViewDetails = (booking) => {
    // Navigate to the HistoryDetails page and pass the booking details
    navigate(`/booking-history-detail/${booking.BookingCourtID}`);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="booking-history-container">
      <div className="booking-history-banner">
        <h1>Booking History</h1>
      </div>
  
      <div className="booking-history-list">
        <h2>Your Booking History List</h2>
        <div className="bookings-grid">
          {bookings.length === 0 && !error ? (
            <p>You have not booked any court venue</p> // Display message for empty bookings
          ) : (
            bookings.map((booking) => (
              <div key={booking.BookingCourtID} className="booking-card">
                <div className="booking-image">
                  <img
                    src={`http://localhost:5000/images/${booking.CourtPic}`}
                    alt={booking.CourtName}
                  />
                </div>
                <div className="booking-info">
                  <h3 className="booking-title">{booking.CourtName}</h3>
                  <p className="booking-date">{booking.BookingCourtDate}</p>
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

export default BookingHistory;