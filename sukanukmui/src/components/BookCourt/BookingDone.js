import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courtbanner from "../../images/bannercourt.jpg"; // Importing banner image
import "./BookingDone.css"; // Importing CSS

const BookDone = () => {
  const navigate = useNavigate();
  const { CourtID } = useParams(); // Extract CourtID from the URL
  const location = useLocation();
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
        <h1 className="heading-1">Book to Play</h1>
      </div>

      <div className="book-court-container1">
        {/* Booking Steps */}

        <div className="booking-steps">
          <div className="step">Booking Details</div>
          <div className="step">Confirmation</div>
          <div className="step active">Done</div>
        </div>

        {/* My Cart Section */}
        <div className= "title">
        <h1>Booking Complete!</h1>
        <h2>Thank you for your booking</h2>
        </div>
        <div className="my-cart1">
          <h2>Booking Details</h2>
          <div className="divider1"></div>
          <div className="cart-content1">
            {/* Details Section */}
            <div className="cart-details1">
              <div className="cart-title">
               Venue:
              </div>
              <div className="cart-location1">
                Gelanggang Serbaguna UKM (Outdoor)
                <p className="cart-map1">
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
          </div>

          <div className="divider2"></div>

          {/* Booking Details Section */}
          <div className="booking-info1">
            <p>
              <span className="label-text1">Date:</span>
              <div className="date-time-section1">{formatDate(date)}</div>
            </p>
            <div className="divider2"></div>
            <span className="label-text1">Time:</span>
            <div className="date-time-section1">
              {times?.length > 0 ? times.join(", ") : "Not selected"}
            </div>
          </div>
          <br />
          <div class="text-box">
             CONFIRMATION ID: 21122
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDone;
