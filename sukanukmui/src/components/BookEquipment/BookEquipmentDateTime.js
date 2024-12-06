import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import equipmentBanner from "../../images/equipment.jpg"; // Importing banner image
import "./BookEquipmentDateTime.css"; // Importing CSS

const BookEquipmentDateTime = () => {
  const navigate = useNavigate();

  const { ItemID } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedReturnDate, setSelectedReturnDate] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [quantity, setQuantity] = useState(1); // Quantity state

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

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
    navigate(`/book-equipment-confirmation/${ItemID}`, {
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
          <div className="step active">Booking Details</div>
          <div className="step">Confirmation</div>
          <div className="step">Done</div>
        </div>

        <div className="booking-details-container">
          <div className="booking-form">
            <h3>
              <span className="number-circle">1</span> Select a date
            </h3>
            <input type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}  />
            {formattedDate && (
              <p>
                <strong>Selected Date:</strong> {formattedDate}
              </p>
            )}

            <h3>
              <span
                className={`number-circle ${
                  selectedDate.length > 0 ? "" : "number-circle-none"
                }`}
              >
                2
              </span>{" "}
              Select a Return Date
              </h3>
              {selectedDate.length > 0 ? ( // Ensure Step 2 input is only accessible after Step 1 is done
                <input
                  type="date"
                  value={selectedReturnDate}
                  onChange={(e) => setSelectedReturnDate(e.target.value)} // Update selectedReturnDate
                />
              ) : (
                <p className="time-message">
                  Please select a date before choosing a return date.
                </p>
              )}
              
              <h3>
                <span
                    className={`number-circle ${
                    selectedReturnDate.length > 0 ? "" : "number-circle-none"
                    }`}
                >
                    3
                </span>{" "}
                Select Quantity
                </h3>
                {selectedReturnDate.length > 0 ? (
                <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    placeholder="Enter quantity"
                />
                ) : (
                <p className="time-message">
                    Please select a return date before entering the quantity.
                </p>
                )}
            </div>

          {/* My Cart Section */}
          <div className="my-cart">
            <h2>My Cart</h2>
            <div className="divider"></div>
            <div className="cart-content">
              {/* Details Section */}
              <div className="cart-details">
                <p className="cart-availability">
                  <strong>Availability: 14 </strong>
                </p>
                <p className="cart-equipment"><strong>Badminton Racket </strong></p>
                <div class="cart-owner">
                  <span class="cart-owner-label">Hak Milik:</span>
                  <span class="cart-owner-name">Pusat Sukan Universiti Kebangsaan Malaysia</span>
                </div>
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
            {selectedReturnDate && (
              <div className="booking-info">
                <strong>Booking Details</strong>
                <p>
                  <strong>Selected Date:</strong> {formatDate(selectedDate)}
                </p>
                <p>
                  <strong>Selected Return Date:</strong> {formatDate(selectedReturnDate)}
                </p>
                <p>
                  <strong>Quantity:</strong> {quantity}
                </p>
              </div>
            )}
            <br />
            {/* Proceed Button */}
            <button
              className="proceed-button"
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEquipmentDateTime;
