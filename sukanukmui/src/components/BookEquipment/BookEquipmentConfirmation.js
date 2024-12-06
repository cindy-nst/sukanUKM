import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import equipmentBanner from "../../images/equipment.jpg"; // Importing banner image
import "./BookEquipmentConfirmation.css"; // Importing CSS


const BookEquipmentConfirmation = () => {
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
    // (e.g., navigate to a form to confirmation equipment)
      navigate(`/book-equipment-done/${ItemID}`, {
        state: { date, returndate, quantity},
      });
    };

    const handleEdit = () => {
      // (e.g., navigate to a form to confirmation equipment)
        navigate(`/book-equipment/${ItemID}`, {
          state: { date: selectedDate, returndate: selectedReturnDate, quantity },
        });
      };



  return (
    <div>
      <div
        className="header-banner"
        style={{
          backgroundImage: `url(${equipmentBanner})`,
          borderRadius: "0px",
        }}
      >
        <h1 className="heading-1">Book Equipment</h1>
      </div>

      <div className="book-equipment-container">
        <div className="booking-steps">
          <div className="step">Booking Details</div>
          <div className="step active">Confirmation</div>
          <div className="step">Done</div>
        </div>

        {/* My Cart Section */}
        <div className="my-cart">
          <h2>Booking Details</h2>
          <div className="divider"></div>
          <div className="cart-content">
            {/* Details Section */}
            <div className="cart-details">
              <div className="cart-sports">
                <span className="cart-title">SPORT EQUIPMENT</span>
              </div>
              <h3 className="cart-equipment">Badminton Racket</h3>
              <p className="ownership">Hak Milik: Pusat Sukan Universiti Kebangsaan Malaysia</p>
            </div>
            {/* Image Section */}
            <div className="cart-image">
              <img
                src={"https://via.placeholder.com/150"} // Replace with actual image URL
                alt="Badminton Racket"
                className="image-preview"
              />
            </div>
          </div>

          <div className="divider"></div>

        {/* Booking Details Section */}
        <div className="booking-info">
          <div className="booking-info-header">
            <strong>Your Booking:</strong>
            <button className="edit-button1" onClick={handleEdit}>
              Edit
            </button>
          </div>
          {/* Dynamic Booking Details */}
          <p>
            <span className="label-text">Selected Date:</span>
            <div className="book-date-section">{formatDate(date)}</div>
          </p>
          <p>
            <span className="label-text">Return Date:</span>
            <div className="return-date-section">{formatDate(returndate)}</div>
          </p>
          <p>
            <span className="label-text">Quantity:</span>
            <div className="quantity-section">{quantity}</div>
          </p>
        </div>
        <br />
        {/* Proceed Button */}
        <button className="reserve-button" onClick={handleProceed}>
          Reserve
        </button>
        </div>
      </div>
    </div>
  );
};

export default BookEquipmentConfirmation;