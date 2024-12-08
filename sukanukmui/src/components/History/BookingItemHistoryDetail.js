import React, { useEffect, useState } from 'react';
import './BookingHistoryDetail.css';
import { useParams } from 'react-router-dom';
import courtbanner from "../../images/bannercourt.jpg"; // Import the image

const BookingItemHistoryDetail = () => {
  const { BookingID } = useParams(); // Get the BookingID from the route
  const [bookingDetail, setBookingDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/booking/${BookingID}`); //change this api to equipment api (undone)
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
      {/* Header Banner */}
      <div
        className="header-banner"
        style={{
          backgroundImage: `url(${courtbanner})`,
          borderRadius: '0px',
        }}
      >
        <h1 className="heading-1">Booking History</h1>
      </div>

      <h2>Your Booking Detail</h2>
      <div className="booking-detail-card">
        <h3>Booking Details</h3>
        <p><strong>Item:</strong> {bookingDetail.ItemName}</p>
        <p><strong>Student Name:</strong> {bookingDetail.StudentName}</p>
        <p><strong>Date:</strong> {bookingDetail.BookingItemDate}</p>
        <p><strong>Returned Date:</strong> {bookingDetail.BookingItemReturnedDate}</p>

        {/* Booking ID Section */}
        <div className="booking-id-box">
          <p><strong>CONFIRMATION ID:</strong> {bookingDetail.BookingItemID}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingItemHistoryDetail;