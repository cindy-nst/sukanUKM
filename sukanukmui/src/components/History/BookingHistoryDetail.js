import React, { useEffect, useState } from 'react';
import './BookingHistoryDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import courtbanner from "../../images/bannercourt.jpg"; // Import the image

const BookingHistoryDetail = () => {
  const navigate = useNavigate();
  const { BookingID } = useParams(); // Get the BookingID from the route
  const [bookingDetail, setBookingDetail] = useState(null);
  const [error, setError] = useState(null);

  const handleProceed = () => {
    navigate("/booking-history");
};

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
    <div>
      {/* Header Banner */}
      <div
        className="header-banner"
        style={{
          backgroundImage: `url(${courtbanner})`,
          borderRadius: "0px",
        }}
      >
        <h1 className="heading-1">Booking History</h1>
      </div>
  
      <div className="book-court-container1">
        {/* Booking Steps */}
        <div className="booking-steps">
          <div className="step active">Done</div>
        </div>
  
        {/* Booking Complete Section */}
        <div className="title">
          <h1>Booking Complete!</h1>
          <h2>Thank you for your booking</h2>
        </div>
  
        {/* Booking Details Section */}
        <div className="my-cart1">
          <h2>Booking Details</h2>
          <div className="divider1"></div>
  
          {/* Venue Section */}
          <div className="cart-content1">
            <div className="cart-details1">
              <div className="cart-title">Venue:</div>
              <div className="cart-location1">
                <p className="cart-map1">{bookingDetail.CourtName || "Unknown Venue"}</p>
              </div>
            </div>
          </div>
  
          <div className="divider2"></div>
  
          {/* Dynamic Booking Details */}
          <div className="booking-info1">
            <p>
              <span className="label-text1">Student Name:</span>
              <div className="book-date-section1">{bookingDetail.StudentName || "N/A"}</div>
            </p>
            <div className="divider2"></div>
  
            <p>
              <span className="label-text1">Date:</span>
              <div className="book-date-section1">{bookingDetail.BookingCourtDate || "N/A"}</div>
            </p>
            <div className="divider2"></div>
  
            <p>
              <span className="label-text1">Time:</span>
              <div className="quantity-section1">{bookingDetail.BookingCourtTime || "N/A"}</div>
            </p>
          </div>
  
          <div className="divider2"></div>
  
          {/* Booking ID Section */}
          <div className="text-box">
            <strong>BOOKING ID:</strong> {bookingDetail.BookingCourtID || "Loading..."}
          </div>
        </div>
  
        <br />
        {/* Home Button */}
        <div
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <button
            className="reserve-button"
            style={{
              width: "40%",
            }}
            onClick={handleProceed}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryDetail;