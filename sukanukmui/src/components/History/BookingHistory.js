import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingHistory.css';
import { UserContext } from '../UserContext';

const BookingHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState('active');

  // Modal state
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getBookingHistory?UserID=${user.UserID}`);
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
    navigate(`/booking-history-detail/${booking.BookingCourtID}`);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cancelCourtBooking/${bookingToCancel}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.BookingCourtID !== bookingToCancel)
      );

      setModalMessage('Booking cancelled successfully.');
      setIsSuccessModalOpen(true);
    } catch (err) {
      setModalMessage(`Error: ${err.message}`);
      setIsSuccessModalOpen(true);
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    const weekday = d.toLocaleString("en-GB", { weekday: "long" });
    return `${day} ${month} ${year}, ${weekday}`;
  };

  const parseFormattedDate = (dateString) => {
    try {
      const [day, month, year] = dateString.split(",")[0].split(" ");
      const months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      return new Date(year, months[month], day);
    } catch {
      return new Date();
    }
  };

  const toggleView = (newView) => {
    setView(newView);
  };

  const filteredBookings = view === 'active'
    ? bookings.filter((booking) => parseFormattedDate(booking.BookingCourtDate) >= new Date())
    : bookings.filter((booking) => parseFormattedDate(booking.BookingCourtDate) < new Date());

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="booking-history-container">
      <div className="booking-history-banner">
        <h1>Booking History</h1>
      </div>

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
                    alt={booking.CourtPic || 'Court'}
                    onError={(e) => e.target.src = '/images/default-placeholder.png'}
                  />
                </div>
                <div className="booking-info">
                  <h3 className="booking-courtID">{booking.BookingCourtID}</h3>
                  <p className="booking-courtname">
                    <span style={{ fontWeight: 'bold' }}>Court Name: </span>
                    {booking.CourtName}
                  </p>
                  <p className="booking-date">
                    <span style={{ fontWeight: 'bold' }}>Booking Date: </span>
                    {booking.BookingCourtDate}
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
                      onClick={() => {
                        setBookingToCancel(booking.BookingCourtID);
                        setIsConfirmationModalOpen(true);
                      }}
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

      {isConfirmationModalOpen && (
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
                onClick={() => setIsConfirmationModalOpen(false)}
                className="close-modal-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Success</h2>
            <p>{modalMessage}</p>
            <div className="modal-buttons">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="okay-button"
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

export default BookingHistory;
