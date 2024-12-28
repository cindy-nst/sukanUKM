import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import equipmentBanner from "../../images/equipment.jpg";
import "./BookEquipmentDateTime.css";

const BookEquipmentDateTime = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, returndate, quantity } = location.state || {};

  const { ItemID } = useParams();
  const [item, setItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(date || "");
  const [selectedReturnDate, setSelectedReturnDate] = useState(returndate || "");
  const [quantityState, setQuantity] = useState(quantity || 1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/availabilitysportequipment/${ItemID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item details.");
        }
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [ItemID]);

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0 && newQuantity <= (item?.AvailableQuantity || 0)) {
      setQuantity(newQuantity);
    } else {
      alert("Quantity exceeds availability.");
    }
  };

  // Validate and set the return date
  const handleReturnDateChange = (e) => {
    const newReturnDate = e.target.value;

    if (selectedDate) {
      const startDate = new Date(selectedDate);
      const endDate = new Date(newReturnDate);
      const diffTime = endDate - startDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays > 2) {
        alert("The return date cannot be more than 3 days after the selected start date.");
        setSelectedReturnDate(""); // Clear invalid date
      } else if (diffDays < 0) {
        alert("The return date cannot be earlier than the selected start date.");
        setSelectedReturnDate(""); // Clear invalid date
      } else {
        setSelectedReturnDate(newReturnDate); // Set valid date
      }
    } else {
      alert("Please select a start date first.");
      setSelectedReturnDate(""); // Clear invalid date
    }
  };

  const handleProceed = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (!selectedDate || !selectedReturnDate || quantityState <= 0) {
        alert("Please fill in all the required fields.");
        return;
      }
      navigate(`/book-equipment-confirmation/${ItemID}`, {
        state: { date: selectedDate, returndate: selectedReturnDate, quantity: quantityState },
      });
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = dateObject.toLocaleString("en-GB", { month: "short" });
    const year = dateObject.getFullYear();
    const weekday = dateObject.toLocaleString("en-GB", { weekday: "long" });
    return `${day} ${month} ${year}, ${weekday}`;
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
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
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <h3>
              <span className={`number-circle ${selectedDate ? "" : "number-circle-none"}`}>
                2
              </span>{" "}
              Select a Return Date
            </h3>
            {selectedDate ? (
              <input
                type="date"
                value={selectedReturnDate}
                onChange={handleReturnDateChange}
              />
            ) : (
              <p className="time-message">Please select a date before choosing a return date.</p>
            )}

            <h3>
              <span className={`number-circle ${selectedReturnDate ? "" : "number-circle-none"}`}>
                3
              </span>{" "}
              Select Quantity
            </h3>
            {selectedReturnDate ? (
              <input
                type="number"
                value={quantityState}
                onChange={handleQuantityChange}
                min="1"
                max={item?.AvailableQuantity}
              />
            ) : (
              <p className="time-message">
                Please select a return date before entering the quantity.
              </p>
            )}
          </div>

          <div className="my-cart">
            <h2>My Cart</h2>
            <div className="divider"></div>
            <div className="cart-content">
              <div className="cart-details">
                <p className="cart-availability">
                  <strong>Availability:</strong> {item?.AvailableQuantity || "0"}
                </p>
                <p className="cart-equipment">
                  <strong>{item?.ItemName || "Unknown Equipment"}</strong>
                </p>
                <div className="cart-owner">
                  <span className="cart-owner-label">Hak Milik:</span>
                  <span className="cart-owner-name">Pusat Sukan Universiti Kebangsaan Malaysia</span>
                </div>
              </div>

              <div className="cart-image">
                <img
                  src={`http://localhost:5000/images/${item?.SportPic}`}
                  alt={item?.ItemName}
                />
              </div>
            </div>

            <div className="divider"></div>

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
                  <strong>Quantity:</strong> {quantityState}
                </p>
              </div>
            )}
            <br />
            <button className="proceed-button" onClick={handleProceed}>
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEquipmentDateTime;
