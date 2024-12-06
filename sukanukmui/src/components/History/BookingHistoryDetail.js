import React, { useEffect, useState } from 'react';
import './BookingHistoryDetail.css';
import { useParams } from 'react-router-dom';

const BookingHistoryDetail = () => {
  const { BookingID } = useParams(); // Get the BookingID from the route
  const [bookingDetail, setBookingDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/booking/${BookingID}`);
        if (!response.ok) {
          throw new Error('Booking detail not found.');
        }
        const data = await response.json();
        setBookingDetail(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch booking details.');
      }
    };
  
    fetchBookingDetail();
  }, [BookingID]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!bookingDetail) {
    return <div className="loading">Loading booking details...</div>;
  }

  return (
    <div className="booking-detail-container">
      <h1>Booking History</h1>
      <h2>Your Booking Detail</h2>
      <div className="booking-detail-card">
        <h3>Booking Details</h3>
        <p><strong>Venue:</strong> {bookingDetail.CourtName}</p>
        <p><strong>Student Name:</strong> {bookingDetail.StudentName}</p>
        <p><strong>Date:</strong> {bookingDetail.BookingCourtDate}</p>
        <p><strong>Time:</strong> {bookingDetail.BookingCourtTime}</p>
      </div>
    </div>
  );
};

export default BookingHistoryDetail;
