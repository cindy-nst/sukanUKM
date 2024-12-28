import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingItemHistory.css';
import { UserContext } from '../UserContext';

const BookingItemHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState('active');  // New state to toggle between active and past bookings

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getBookingItemHistory?UserID=${user.UserID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchBookings();
  }, [user.UserID]);

  const handleViewDetails = (booking) => {
    navigate(`/booking-item-detail/${booking.BookingItemID}`);
  };

  const handleCancelBooking = async () => {
    if (bookingToCancel) {
      try {
        const response = await fetch(`http://localhost:5000/api/cancelBooking/${bookingToCancel}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to cancel booking');
        }
  
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.BookingItemID !== bookingToCancel)
        );
  
        alert('Booking cancelled successfully.');
      } catch (err) {
        alert(err.message);
      } finally {
        setIsModalOpen(false); // Close the modal after the action
      }
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleView = (newView) => {
    setView(newView); // Toggle between 'active' and 'past'
  };

  const filteredBookings = view === 'active' ? 
    bookings.filter(booking => new Date(booking.BookingItemDate) >= new Date()) :
    bookings.filter(booking => new Date(booking.BookingItemDate) < new Date());

  return (
    <div className="booking-history-container">
      <div className="booking-history-banner">
        <h1>Booking History</h1>
      </div>

      {/* Container for toggle buttons */}
      <div className="toggle-button-container">
        <button onClick={() => toggleView('active')} className={view === 'active' ? 'active' : ''}>
          Active Booking
        </button>
        <button onClick={() => toggleView('past')} className={view === 'past' ? 'active' : ''}>
          Past Booking
        </button>
      </div>

      <div className="booking-section">
        <div className="bookings-grid">
          {filteredBookings.length === 0 ? (
            <p className="no-bookings-message">
              You have no {view === 'active' ? 'active' : 'past'} bookings
            </p>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.BookingItemID} className="booking-card">
                <div className="booking-image">
                  <img
                    src={`http://localhost:5000/images/${booking.SportPic}`}
                    alt={booking.ItemName}
                  />
                </div>
                <div className="booking-info">
                  <h3 className="booking-title">Item: {booking.ItemID}</h3>
                  <p className="booking-date">
                    <span style={{ fontWeight: 'bold' }}>Booking Date: </span>{formatDate(booking.BookingItemDate)}<br />
                    <span style={{ fontWeight: 'bold' }}>Return Date: </span>{formatDate(booking.BookingItemReturnedDate)}
                  </p>
                  <div className="button-group">
                    <button
                      className="view-button"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View
                    </button>
                    {view === 'active' && (
                      <button
                        className="cancel-button"
                        onClick={() => {
                          setBookingToCancel(booking.BookingItemID); // Fix: Using BookingItemID for cancellation
                          setIsModalOpen(true);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Cancellation</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="modal-buttons">
              <button 
                onClick={handleCancelBooking}
                className="confirm-button"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingItemHistory;
