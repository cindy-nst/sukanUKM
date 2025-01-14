import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courtbanner from "../../images/bannercourt.jpg"; // Importing banner image
import "./BookConfirmation.css"; // Importing CSS
import { UserContext } from '../UserContext';

const BookConfirmation = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { CourtID } = useParams(); // Extract CourtID from the URL
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { date, times } = location.state || {};
  const [court, setCourt] = useState(null); // Backend data for court
  const [locationName, setLocationName] = useState(null); // Location name

  // Fetch court details from backend
  useEffect(() => {
    const fetchCourtDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/courts/${CourtID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch court details.");
        }
        const data = await response.json();
        setCourt(data);

        // Fetch location name if CourtLocation exists
        if (data.CourtLocation) {
          const [lat, lng] = data.CourtLocation.split(",").map(Number);
          fetchLocationName(lat, lng);
        }
      } catch (err) {
        console.error("Error fetching court details:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourtDetails();
  }, [CourtID]);

  // Fetch location name from Mapbox API
  const fetchLocationName = async (lat, lng) => {
    const accessToken = "pk.eyJ1IjoibWhyYWZhZWwiLCJhIjoiY20zcG83ZDZiMGV0ejJrczgxaWJwN2g3YyJ9.wfWyzucTHcQkYjKJtjbVCw"; // Replace with a valid Mapbox access token
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setLocationName(data.features[0].place_name); // Use the place name from Mapbox API
      } else {
        setLocationName(`${lat}, ${lng}`); // Fallback to coordinates if no name is found
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName(`${lat}, ${lng}`); // Fallback to coordinates in case of an error
    }
  };

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
      console.log(date);
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
    setIsLoading(true);
    setTimeout(async () => {
      const formattedTimes = `${times[0].split(" - ")[0]} - ${times[times.length - 1].split(" - ")[1]}`;
      const bookingData = {
        CourtID: CourtID,
        StudentID: user.UserID,
        BookingCourtTime: formattedTimes,
        BookingCourtDate: formatDate(date),
      };
    
      try {
        const response = await fetch('http://localhost:5000/api/addBookingCourt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });
    
        const result = await response.json();
        if (response.ok) {
          //alert(result.message);
          navigate(`/book-done/${CourtID}`, {
            state: { date, times, bookingCourtID: result.bookingCourtID },
            replace: true, // This replaces the current history entry
          });
        } else {
          alert(result.message || 'Failed to add court');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the court');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bookingitemhistory-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Header Banner */}
      <div
        className="bookcourt-banner"
      >
        <h1 className="heading-1">Book to Play</h1>
      </div>

      <div className="book-court-container">
        {/* Booking Steps */}
        <div className="booking-steps">
          <div className="step">Booking Details</div>
          <div className="step active">Confirmation</div>
          <div className="step">Complete</div>
        </div>

        {/* My Cart Section */}
        <div className="my-cart">
          <h2>Booking Details</h2>
          <div className="divider"></div>
          <div className="cart-content">
            {/* Details Section */}
            <div className="cart-details">
              <div className="cart-sports">
                <strong>{court?.CourtDescription || "No description available"}</strong>
              </div>
              <div className="cart-location">
                {court?.CourtName || "Unknown Venue"}
                <p className="cart-map">
                  <a
                    href={
                      court?.CourtLocation
                        ? `https://www.google.com/maps?q=${encodeURIComponent(court.CourtLocation)}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-map-marker" aria-hidden="true"></i>{" "}
                    📍 {locationName || (court?.CourtLocation ? "Fetching location..." : "Location not available")}
                  </a>
                </p>
              </div>
            </div>
            {/* Image Section */}
            <div className="cart-image">
              <img
                src={court?.CourtPic ? `http://localhost:5000/images/${court.CourtPic}` : "path/to/default/image.jpg"}
                alt={court?.CourtName || "Court Image"}
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
            {/* Dynamic Date and Time Section */}
            <p>
              <span className="label-text">Date:</span>
              <div className="date-time-section">{formatDate(date)}</div>
            </p>
            <span className="label-text">Time:</span>
            <div className="date-time-section">
              {times?.length > 0 ? `${times[0].split(" - ")[0]} - ${times[times.length - 1].split(" - ")[1]}` : "Not selected"}
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
