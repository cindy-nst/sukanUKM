import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courtbanner from "../../images/bannercourt.jpg"; // Importing banner image
import "./BookConfirmation.css"; // Importing CSS

const BookConfirmation = () => {
  const navigate = useNavigate();
  const { CourtID } = useParams(); // Extract CourtID from the URL
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { date, times } = location.state || {};

  const formatDate = (date) => {
    if (!date) return "Not selected";
    const dateObject = new Date(date);

    const day = dateObject.getDate(); // Day of the month
    const month = dateObject.toLocaleString("en-GB", { month: "short" }); // Abbreviated month
    const year = dateObject.getFullYear(); // Full year
    const weekday = dateObject.toLocaleString("en-GB", { weekday: "long" }); // Day of the week

    // Format: "19 Oct 2024, Monday"
    return `${day} ${month} ${year}, ${weekday}`;
  };

  const handleEdit = () => {
    setIsLoading(true); // Start loading animation
    setTimeout(() => {
    // Navigate back to the booking details page for edits
    navigate(`/book/${CourtID}`, {
      state: {
        date: date,
        times: times,
      },
    });
    setIsLoading(false); // Stop loading animation after navigation
}, 1000);
  };

  const handleProceed = () => {
    setIsLoading(true); // Start loading animation
    setTimeout(() => {
      navigate(`/book-done/${CourtID}`, {
        state: { date, times },
      });
      setIsLoading(false); // Stop loading animation after navigation
    }, 2000);
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Header Banner */}
      <div
        className="header-banner"
        style={{
          backgroundImage: `url(${courtbanner})`,
          borderRadius: "0px",
        }}
      >
        <h1 className="heading-1">Book to Play</h1>
      </div>

      <div className="book-court-container">
        {/* Booking Steps */}
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
                <strong>HANDBALL, HOCKEY, FUTSAL, DODGEBALL</strong>
              </div>
              <div className="cart-location">
                Gelanggang Serbaguna UKM (Outdoor)
                <p className="cart-map">
                  <a
                    href="https://maps.app.goo.gl/R1rnWL8kvUpdobXa8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-map-marker" aria-hidden="true"></i>{" "}
                    📍 https://maps.app.goo.gl/R1rnWL8kvUpdobXa8
                  </a>
                </p>
              </div>
            </div>
            {/* Image Section */}
            <div className="cart-image">
              <img src={courtbanner} alt="Court" />
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
            {/* Dynamic Date and Time Section */}
            <p>
              <span className="label-text">Date:</span>
              <div className="date-time-section">{formatDate(date)}</div>
            </p>
            <span className="label-text">Time:</span>
            <div className="date-time-section">
              {times?.length > 0 ? times.join(", ") : "Not selected"}
            </div>
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

export default BookConfirmation;
