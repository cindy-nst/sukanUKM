import React, { useEffect, useState } from 'react';
import './BookingItemHistoryDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import courtbanner from "../../images/bannercourt.jpg"; // Import the image

const BookingItemHistoryDetail = () => {
  const navigate = useNavigate();
  const { BookingID } = useParams(); // Get the BookingID from the route
  console.log('BookingID from URL:', BookingID); // Check if BookingID is coming through correctly

  const [bookingDetail, setBookingDetail] = useState(null);
  const [error, setError] = useState(null);

   // Function to format the date
   const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = dateObject.toLocaleString("en-GB", { month: "short" });
    const year = dateObject.getFullYear();
    const weekday = dateObject.toLocaleString("en-GB", { weekday: "long" });
    return `${day} ${month} ${year}, ${weekday}`;
  };

  const handleProceed = () => {
    navigate("/booking-item-history");
  };

  useEffect(() => {
    console.log('useEffect triggered for BookingID:', BookingID);  // Check if useEffect is triggered

    const fetchBookingDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookingitem/${BookingID}`);
        if (!response.ok) {
          throw new Error('Booking detail not found.');
        }
        const data = await response.json();
        setBookingDetail(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch booking details.');
      }
    };

    if (BookingID) {
      fetchBookingDetail();
    }

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
        
  
        {/* Booking Complete Section */}
        <div className="title">
          <h1>Your Booking Details</h1>
          
        </div>
  
        {/* Booking Details Section */}
        <div className="my-cart1">
          <h2>Booking Details</h2>
          <div className="divider1"></div>
  
          <div className="booking-info1">
            <p>
              <span className="label-text1">Item:</span>
              <div className="book-date-section1">{bookingDetail.ItemName || "Unknown Venue"}</div>
            </p>
          </div>
          <div className="divider2"></div>
  
          {/* Dynamic Booking Details */}
          <div className="booking-info1">
            <p>
              <span className="label-text1">Name:</span>
              <div className="book-date-section1">{bookingDetail.StudentName || "N/A"}</div>
            </p>
            <div className="divider2"></div>
  
            <p>
              <span className="label-text1">Booking Date:</span>
              <div className="book-date-section1">{formatDate(bookingDetail.BookingItemDate || "N/A")}</div>
            </p>
            <div className="divider2"></div>

            <p>
              <span className="label-text1">Return Date:</span>
              <div className="book-date-section1">{formatDate(bookingDetail.BookingItemReturnedDate || "N/A")}</div>
            </p>
            <div className="divider2"></div>
  
            <p>
              <span className="label-text1">Quantity:</span>
              <div className="quantity-section1">{bookingDetail.BookingItemQuantity || "N/A"}</div>
            </p>
          </div>
  
          <div className="divider2"></div>
  
          {/* Booking ID Section */}
          <div className="text-box">
            <strong>BOOKING ID:</strong> {bookingDetail.BookingItemID || "Loading..."}
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
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingItemHistoryDetail;