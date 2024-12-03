import React, { useState, useEffect} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courtbanner from "../../images/bannercourt.jpg"; // Importing banner image
import "./BookingDone.css"; // Importing CSS

const BookDone = () => {
  const navigate = useNavigate();
  const { CourtID } = useParams(); // Extract CourtID from the URL
  const location = useLocation();
  const { date, times, bookingCourtID} = location.state || {};
  const [locationName, setLocationName] = useState(null); // Location name
  const [court, setCourt] = useState(null); //backend
  const [isLoading, setIsLoading] = useState(false);

  // Fetch court details :-backend
  useEffect(() => {
    const fetchCourtDetails = async () => {
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

  const handleProceed = () => {
      navigate('/book-court');
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
                {court?.CourtName || "Unknown Venue"}
                <p className="cart-map1">
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
          
          <div class="text-box">
             BOOKING ID : {bookingCourtID || "Not available"}
          </div>
        </div>
        <br/>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <button
            className="reserve-button"
            style={{
              width: '40%',
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

export default BookDone;
