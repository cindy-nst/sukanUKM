import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingHistory.css';
import { UserContext } from '../UserContext';

const BookingHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]); // Initial state for bookings
  const [error, setError] = useState(null); // State for error handling
  const [view, setView] = useState('active'); // Toggle between 'active' and 'past'

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
  }, [user.UserID]); // Dependency array includes user.UserID

  // Navigate to booking details page
  const handleViewDetails = (booking) => {
    navigate(`/booking-history-detail/${booking.BookingCourtID}`);
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingID) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/cancelBooking/${bookingID}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to cancel booking');
        }

        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.BookingCourtID !== bookingID)
        );

        alert('Booking cancelled successfully.');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Format date to DD MMM YYYY, Weekday (same format as in BookCourtDate.js)
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    const weekday = d.toLocaleString("en-GB", { weekday: "long" });
    return `${day} ${month} ${year}, ${weekday}`;
  };

  // Toggle between active and past bookings
  const toggleView = (newView) => {
    setView(newView);
  };

  // Filter bookings into active and past
  const filteredBookings = view === 'active'
    ? bookings.filter((booking) => new Date(booking.BookingCourtDate) >= new Date())
    : bookings.filter((booking) => new Date(booking.BookingCourtDate) < new Date());

  // Render error message if any
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="booking-history-container">
      <div className="booking-history-banner">
        <h1>Booking History</h1>
      </div>

      {/* Toggle buttons for active and past bookings */}
      <div className="toggle-button-container">
        <button
          onClick={() => toggleView('active')}
          className={view === 'active' ? 'active' : ''}
        >
          Active Bookings
        </button>
        <button
          onClick={() => toggleView('past')}
          className={view === 'past' ? 'active' : ''}
        >
          Past Bookings
        </button>
      </div>

      <div className="booking-history-list">
        <div className="bookings-grid">
          {filteredBookings.length === 0 ? (
            <p className="no-bookings-message">
              You have no {view === 'active' ? 'active' : 'past'} bookings.
            </p>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.BookingCourtID} className="booking-card">
                <div className="booking-image">
                  <img
                    src={`http://localhost:5000/images/${booking.CourtPic}`}
                    alt={booking.CourtName}
                  />
                </div>
                <div className="booking-info">
                  <h3 className="booking-title">{booking.CourtName}</h3>
                  <p className="booking-date">
                    <span style={{ fontWeight: 'bold' }}>Booking Date: </span>
                    {formatDate(booking.BookingCourtDate)}
                  </p>
                  <button
                    className="view-button"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View
                  </button>
                  {view === 'active' && (
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelBooking(booking.BookingCourtID)}
                    >
                      Cancel
                    </button>
                  )}
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
