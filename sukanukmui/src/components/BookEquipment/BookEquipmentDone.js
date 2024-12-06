import React, { useState, useEffect} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import equipmentBanner from "../../images/equipment.jpg"; // Importing banner image
import "./BookEquipmentDone.css"; // Importing CSS

const BookEquipmentDone = () => {
    const navigate = useNavigate();


    const { ItemID } = useParams();
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedReturnDate, setSelectedReturnDate] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const location = useLocation();

    const { date, returndate, quantity } = location.state || {};

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
      // Implement "Add equipment" functionality (e.g., navigate to a form to add new equipment)
      navigate("/home");
    };

      return (
        <div>
          {/* Header Banner */}
          <div
            className="header-banner"
            style={{
              backgroundImage: `url(${equipmentBanner})`,
              borderRadius: "0px",
            }}
          >
            <h1 className="heading-1">Book to Play</h1>
          </div>
    
          <div className="book-court-container1">
            {/* Booking Steps */}
            <div className="booking-steps">
              <div className="step">Booking Details</div>
              <div className="step">Confirmation</div>
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
    
              {/* Equipment Section */}
              <div className="cart-content1">
                <div className="cart-details1">
                  <div className="cart-title">Equipment:</div>
                  <div className="cart-location1">
                    <p className="cart-map1">Badminton Racket</p>
                  </div>
                  <div>
                    <p class="ownership-info">Hak Milik: Pusat Sukan Universiti Kebangsaan Malaysia</p>
                  </div>
                </div>
              </div>
    
              <div className="divider2"></div>
    
              {/* Dynamic Booking Details */}
              <div className="booking-info1">
                <p>
                  <span className="label-text1">Date:</span>
                  <div className="book-date-section1">{formatDate(date)}</div>
                </p>
                <div className="divider2"></div>
    
                <p>
                  <span className="label-text1">Return Date:</span>
                  <div className="return-date-section1">{formatDate(returndate)}</div>
                </p>
                <div className="divider2"></div>
    
                <p>
                  <span className="label-text1">Quantity:</span>
                  <div className="quantity-section1">{quantity}</div>
                </p>
              </div>
    
              <div className="divider2"></div>
    
              {/* Booking ID Section */}
              <div className="text-box">
                <strong>BOOKING ID:</strong> 10021
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
                Home
              </button>
            </div>
          </div>
        </div>
      );
    };

export default BookEquipmentDone;