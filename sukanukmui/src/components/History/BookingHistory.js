import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingHistory.css';

const BookingHistory = () => {
  const navigate = useNavigate();

  // Dummy data for booking history
  const dummyBookings = [
    {
      BookingID: 1,
      Image: "futsal_court.jpg",
      Title: "KPZ Court Futsal",
      Date: "30 Oct 2024",
      Venue: "Venue: KPZ Court Futsal"
    },
    {
      BookingID: 2,
      Image: "futsal_court.jpg",
      Title: "KPZ Court Futsal",
      Date: "19 Oct 2024",
      Venue: "Venue: KPZ Court Futsal"
    },
    {
      BookingID: 3,
      Image: "outdoor_court.jpg",
      Title: "Gelanggang Serbaguna UKM (Outdoor)",
      Date: "11 Oct 2024",
      Venue: "Venue: Gelanggang Serbaguna UKM (Outdoor)"
    },
    {
      BookingID: 4,
      Image: "handball.jpg",
      Title: "Handball Molten Size 3",
      Date: "27 Sept 2024",
      Venue: "Equipment: Handball Molten Size 3"
    },
    {
      BookingID: 5,
      Image: "badminton_racket.jpg",
      Title: "Badminton Racket",
      Date: "10 Sept 2024",
      Venue: "Equipment: Badminton Racket"
    },
    {
      BookingID: 6,
      Image: "stadium_ukm.jpg",
      Title: "Stadium UKM",
      Date: "17 Oct 2023",
      Venue: "Venue: Stadium UKM"
    },
  ];

  const [bookings] = useState(dummyBookings);

  const handleViewDetails = (booking) => {
    // Navigate to the HistoryDetails page and pass the booking details
    navigate('/booking-history-detail/${booking.BookingID}', { state: { bookingDetail: booking } });
  };

  return (
    <div className="booking-history-container">
      <div className="booking-history-banner">
        <h1>Booking History</h1>
      </div>

      <div className="booking-history-list">
        <h2>Your Booking History List</h2>
        <div className="bookings-grid">
          {bookings.length === 0 ? (
            <p>No bookings found</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.BookingID} className="booking-card">
                <div className="booking-image">
                  <img
                    src={`http://localhost:5000/images/${booking.Image}`} // Replace with actual image URL
                    alt={booking.Title}
                  />
                </div>
                <div className="booking-info">
                  <h3 className="booking-title">{booking.Title}</h3>
                  <p className="booking-date">{booking.Date}</p>
                  <p className="booking-venue">{booking.Venue}</p>
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