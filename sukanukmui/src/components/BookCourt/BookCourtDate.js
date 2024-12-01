import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courtbanner from "../../images/bannercourt.jpg"; // Importing banner image
import "./BookCourtDate.css"; // Importing CSS

const BookCourtDate = () => {
  const navigate = useNavigate();
  const { CourtID } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { date: initialDate, times: initialTimes } = location.state || {};

  const [selectedDate, setSelectedDate] = useState(initialDate || "");
  const [selectedTimes, setSelectedTimes] = useState(initialTimes || []);
  const [formattedDate, setFormattedDate] = useState("");

  const predefinedTimes = [
    "8:00-9:00 AM",
    "9:00-10:00 AM",
    "10:00-11:00 AM",
    "11:00-12:00 PM",
    "12:00-13:00 PM",
    "13:00-14:00 PM",
    "14:00-15:00 PM",
    "15:00-16:00 PM",
    "16:00-17:00 PM",
    "17:00-18:00 PM",
    "18:00-19:00 PM",
    "19:00-20:00 PM",
    "20:00-21:00 PM",
    "21:00-22:00 PM",
  ];

  // Handle date change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date) {
      // Parse the selected date
      const dateObject = new Date(date);

      // Extract components for custom format
      const day = dateObject.getDate(); // Day of the month
      const month = dateObject.toLocaleString("en-GB", { month: "short" }); // Abbreviated month
      const year = dateObject.getFullYear(); // Full year
      const weekday = dateObject.toLocaleString("en-GB", { weekday: "long" }); // Day of the week

      // Construct the desired format: "19 Oct 2024, Monday"
      const formatted = `${day} ${month} ${year}, ${weekday}`;
      setFormattedDate(formatted);
    } else {
      setFormattedDate(""); // Reset if no date selected
      setSelectedTimes([]); // Reset selected times when date is cleared
    }
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time)); // Deselect time
    } else {
      setSelectedTimes([...selectedTimes, time]); // Add selected time
    }
  };

  // Proceed to confirmation
  const handleProceed = () => {
    setIsLoading(true); // Start loading animation
    setTimeout(() => {
    if (!selectedDate || selectedTimes.length === 0) {
      alert("Please select both a date and at least one time slot.");
      return;
    }
    navigate(`/book-confirmation/${CourtID}`, {
      state: {
        date: selectedDate,
        times: selectedTimes,
      },
    });
    setIsLoading(false); // Stop loading animation after navigation
  }, 1000);
  };

  useEffect(() => {
    // When the initialDate or selectedDate changes, format the date accordingly
    if (selectedDate) {
      const dateObject = new Date(selectedDate);
      const day = dateObject.getDate(); // Day of the month
      const month = dateObject.toLocaleString("en-GB", { month: "short" }); // Abbreviated month
      const year = dateObject.getFullYear(); // Full year
      const weekday = dateObject.toLocaleString("en-GB", { weekday: "long" }); // Day of the week
      const formatted = `${day} ${month} ${year}, ${weekday}`;
      setFormattedDate(formatted);
    }
  }, [selectedDate]);

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
          <div className="step active">Booking Details</div>
          <div className="step">Confirmation</div>
          <div className="step">Done</div>
        </div>

        {/* Booking Details */}
        <div className="booking-details-container">
          {/* Booking Form */}
          <div className="booking-form">
            <h3>
              <span className="number-circle">1</span> Select a date
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
            {formattedDate && (
              <p>
                <strong>Selected Date:</strong> {formattedDate}
              </p>
            )}

            <h3>
              <span
                className={`number-circle ${
                  selectedDate ? "number-circle" : "number-circle-none"
                }`}
              >
                2
              </span>{" "}
              Select a time
            </h3>
            {selectedDate ? (
              <div className="time-slots">
                {predefinedTimes.map((time, index) => (
                  <button
                    key={index}
                    className={`time-slot ${
                      selectedTimes.includes(time) ? "selected" : ""
                    }`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="time-message">
                Available timings for your selected date will be shown here.
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
                <p className="cart-sports">
                  <strong>HANDBALL, HOCKEY, FUTSAL, DODGEBALL</strong>
                </p>
                <p className="cart-location">Gelanggang Serbaguna UKM (Outdoor)</p>
                <p className="cart-map">
                  <a
                    href="https://maps.app.goo.gl/R1rnWL8kvUpdobXa8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-map-marker" aria-hidden="true"></i> View on Google Maps
                  </a>
                </p>
              </div>

              {/* Image Section */}
              <div className="cart-image">
                <img src={courtbanner} alt="Court" />
              </div>
            </div>

            <div className="divider"></div>

            {/* Booking Details Section */}
            {selectedDate && (
              <div className="booking-info">
                <strong>Booking Details</strong>{" "}
                {/* Dynamic Date and Time Section */}
                <div className="date-section">
                  <br />
                  {formattedDate || "Not selected"}
                </div>
                <div className="date-time-section">
                  {selectedTimes.length > 0
                    ? selectedTimes.join(", ")
                    : "Not selected"}
                </div>
              </div>
            )}
            <br />
            {/* Proceed Button */}
            <button
              className="proceed-button"
              onClick={handleProceed}
              disabled={!selectedDate || selectedTimes.length === 0}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCourtDate;
