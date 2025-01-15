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
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // Confirmation modal for cancellation
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Success modal after cancellation
  const [modalMessage, setModalMessage] = useState(""); // Message to display in success modal
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
  
        setModalMessage('Booking cancelled successfully.');
        setIsSuccessModalOpen(true); // Open success modal after cancellation
      } catch (err) {
        setModalMessage(`Error: ${err.message}`);
        setIsSuccessModalOpen(true); // Open success modal with error message
      } finally {
        setIsConfirmationModalOpen(false); // Close confirmation modal
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
                    alt={booking.SportPic}
                  />
                </div>
                <div className="booking-info">
                  <h3 className="booking-title">{booking.BookingItemID}</h3>
                  <p className="booking-itemname">
                    <span style={{fontWeight:'bold'}}> Item: </span>
                    {booking.ItemName}
                  </p>
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
                          setIsConfirmationModalOpen(true);
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

      {/* Confirmation Modal for cancellation */}
      {isConfirmationModalOpen && (
        <div className="modal-overlay-bih">
          <div className="modal-content-bih">
            <h2>Confirm Cancellation</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="modal-buttons-bih">
              <button 
                onClick={handleCancelBooking}
                className="confirm-button-bih"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsConfirmationModalOpen(false)}
                className="cancel-button-booking-bih"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal after cancellation */}
      {isSuccessModalOpen && (
        <div className="modal-overlay-bih">
          <div className="modal-content-bih">
            <h2>Success</h2>
            <p>{modalMessage}</p>
            <div className="modal-buttons-bih">
              <button 
                onClick={() => setIsSuccessModalOpen(false)} // Close the modal
                className="okay-button-bih"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingItemHistory;
