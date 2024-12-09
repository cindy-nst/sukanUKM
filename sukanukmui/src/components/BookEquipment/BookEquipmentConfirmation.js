import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import equipmentBanner from "../../images/equipment.jpg"; // Importing banner image
import "./BookEquipmentConfirmation.css"; // Importing CSS
import { UserContext } from '../UserContext';

const BookEquipmentConfirmation = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { ItemID } = useParams(); // Extract ItemID from the URL
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const { date, returndate, quantity } = location.state || {};
  const [item, setItem] = useState(null); // Store equipment details

  // Fetch equipment details from the backend
  useEffect(() => {
    const fetchItemDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/sportequipment/${ItemID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item details.");
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error("Error fetching item details:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [ItemID]);

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

  const handleProceed = async () => {
    setIsLoading(true);
    setTimeout(async () => {
    const bookingData = {
      ItemID: ItemID,
      StudentID: user.UserID,
      BookingItemDate: date,
      BookingItemReturnedDate: returndate,
      BookingItemQuantity: quantity,
    };
  
    console.log("Booking Data Sent:", bookingData);
  
    try {
      const response = await fetch("http://localhost:5000/api/addBookingEquipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
  
      const result = await response.json();
      console.log("API Response:", result);
  
      if (response.ok) {
        navigate(`/book-equipment-done/${ItemID}`, {
          state: { date, returndate, quantity, bookingItemID: result.bookingItemID },
          replace: true,
        });
      } else {
        alert(result.message || "Failed to reserve equipment");
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("An error occurred while saving the booking.");
    }
      setIsLoading(false);
    }, 2000);
  };
  

  // Handle the 'Edit' button action
  const handleEdit = () => {
    navigate(`/book-equipment/${ItemID}`, {
      state: { date, returndate, quantity },
    });
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
              <h3 className="cart-equipment">{item?.ItemName || "Unknown Equipment"}</h3>
              <p className="ownership">
                Hak Milik: {item?.Owner || "Pusat Sukan Universiti Kebangsaan Malaysia"}
              </p>
            </div>
            {/* Image Section */}
            <div className="cart-image">
              <img
                src={`http://localhost:5000/images/${item?.SportPic}`} // Replace with actual image URL from backend
                alt={item?.ItemName || "Unknown Equipment"}
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
               <span className="label-text">Selected Date: </span>
               <span className="book-date-section">{formatDate(date)}</span>
            </p>
            <p>
               <span className="label-text">Return Date: </span>
               <span className="return-date-section">{formatDate(returndate)}</span>
            </p>
            <p>
               <span className="label-text">Quantity: </span>
                <span className="quantity-section">{quantity}</span>
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
