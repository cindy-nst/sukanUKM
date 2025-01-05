import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courtbanner from "../../images/bannercourt.jpg"; // Importing banner image
import "./BookCourtDate.css"; // Importing CSS

const BookCourtDate = () => {
  const navigate = useNavigate();
  const { CourtID } = useParams();
  const location = useLocation();
  const [court, setCourt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { date: initialDate, times: initialTimes } = location.state || {};
  const [locationName, setLocationName] = useState(null); // Location name

  const [selectedDate, setSelectedDate] = useState(initialDate || "");
  const [selectedTimes, setSelectedTimes] = useState(initialTimes || []);
  const [formattedDate, setFormattedDate] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]); // Store booked times

  // Fetch court details
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
  
    const fetchInitialBookedTimes = async () => {
      if (initialDate) {
        const dateObject = new Date(initialDate);
        const day = dateObject.getDate();
        const month = dateObject.toLocaleString("en-GB", { month: "short" });
        const year = dateObject.getFullYear();
        const weekday = dateObject.toLocaleString("en-GB", { weekday: "long" });
        const formattedDate = `${day} ${month} ${year}, ${weekday}`;
  
        setSelectedDate(initialDate); // Set the selected date
        setFormattedDate(formattedDate); // Set formatted date
        await fetchBookedTimes(formattedDate); // Fetch booked times
      }
    };
  
    fetchCourtDetails();
    fetchInitialBookedTimes();
  }, [CourtID]); // Only re-run when `CourtID` changes  

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

  const predefinedTimes = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM",
    "08:00 PM - 09:00 PM",
    "09:00 PM - 10:00 PM",
    "10:00 PM - 11:00 PM",
    "11:00 PM - 12:00 AM",
  ];

  // Format selected date and fetch booked times
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTimes([]);

    if (date) {
      const dateObject = new Date(date);
      const day = dateObject.getDate();
      const month = dateObject.toLocaleString("en-GB", { month: "short" });
      const year = dateObject.getFullYear();
      const weekday = dateObject.toLocaleString("en-GB", { weekday: "long" });
      setFormattedDate(`${day} ${month} ${year}, ${weekday}`);

      // Fetch already booked times for this date
      await fetchBookedTimes(`${day} ${month} ${year}, ${weekday}`);
    } else {
      setFormattedDate("");
      setBookedTimes([]); // Reset booked times if date is cleared
    }
  };

  // Fetch booked times for a selected date
  const fetchBookedTimes = async (selectedDate) => {
    console.log(`Formatted Date: ${selectedDate}`);

    try {
      const response = await fetch(
        `http://localhost:5000/api/getBookedTimes?courtID=${CourtID}&date=${encodeURIComponent(selectedDate)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch booked times.");
      }
      const data = await response.json();
      console.log("Booked Times:", data.bookedTimes);
      setBookedTimes(data.bookedTimes || []); // Ensure the API returns an array of booked times
    } catch (err) {
      console.error("Error fetching booked times:", err.message);
    } 
  };  

  // Toggle time selection
  const handleTimeSelect = (time) => {
    if (!bookedTimes.includes(time)) {
      setSelectedTimes((prev) => {
        const updatedTimes = prev.includes(time)
          ? prev.filter((t) => t !== time) // Remove the time if already selected
          : [...prev, time]; // Add the time if not selected
        
        // Sort the updated times array in chronological order
        return updatedTimes.sort((a, b) => {
          const parseTime = (t) => {
            const [hour, minute, period] = t.match(/(\d+):(\d+)\s([AP]M)/).slice(1);
            let totalMinutes = parseInt(hour) % 12 * 60 + parseInt(minute);
            if (period === "PM") totalMinutes += 12 * 60;
            return totalMinutes;
          };
          return parseTime(a) - parseTime(b);
        });
      });
    }
  };
  

  // Proceed to confirmation
  const handleProceed = () => {
    if (!selectedDate || selectedTimes.length === 0) {
      alert("Please select both a date and at least one time slot.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/book-confirmation/${CourtID}`, {
        state: { date: selectedDate, times: selectedTimes },
      });
      setIsLoading(false);
    }, 1000);
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
          backgroundImage: `url(${courtbanner})`,
          borderRadius: "0px",
        }}
      >
        <h1 className="heading-1">Book to Play</h1>
      </div>

      <div className="book-court-container">
        <div className="booking-steps">
          <div className="step active">Booking Details</div>
          <div className="step">Confirmation</div>
          <div className="step">Complete</div>
        </div>

        <div className="booking-details-container">
          <div className="booking-form">
            <h3>
              <span className="number-circle">1</span> Select a date
            </h3>
            <input type="date" value={selectedDate} onChange={handleDateChange} />
            {formattedDate && (
              <p>
                <strong>Selected Date:</strong> {formattedDate}
              </p>
            )}

            <h3>
              <span
                className={`number-circle ${
                  selectedDate ? "" : "number-circle-none"
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
                    className={`time-slot ${selectedTimes.includes(time) ? "selected" : ""}`}
                    onClick={() => handleTimeSelect(time)}
                    disabled={bookedTimes.includes(time)} // Disable if the time is already booked
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
                  <strong>{court?.CourtDescription || "No description available"} </strong>
                </p>
                <p className="cart-location">{court?.CourtName || "Unknown Venue"}</p>
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
            {selectedDate && (
              <div className="booking-info">
                <strong>Booking Details</strong>
                <p>{formattedDate || "Not selected"}</p>
                <p>{selectedTimes.length > 0 ? selectedTimes.join(", ") : "Not selected"}</p>
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
