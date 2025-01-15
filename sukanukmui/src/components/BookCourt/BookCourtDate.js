import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courtbanner from "../../images/bannercourt.jpg"; // Importing banner image
import "./BookCourtDate.css"; // Importing CSS

// Modal Component
const Modal = ({ message, onClose }) => (
  <div className="modal-overlay-bcd">
    <div className="modal-content-bcd">
      <div className="modal-body-bcd">
        <p>{message}</p>
      </div>
      <div className="modal-footer-bcd">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

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
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalMessage, setModalMessage] = useState(""); // Modal message

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
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
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

  const groupTimes = (times) => {
    if (times.length === 0) return [];
    
    const groupedRanges = [];
    const indices = times.map((time) => predefinedTimes.indexOf(time)).sort((a, b) => a - b);
  
    let start = indices[0];
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) {
        groupedRanges.push(`${predefinedTimes[start].split(" - ")[0]} - ${predefinedTimes[indices[i - 1]].split(" - ")[1]}`);
        start = indices[i];
      }
    }
    groupedRanges.push(`${predefinedTimes[start].split(" - ")[0]} - ${predefinedTimes[indices[indices.length - 1]].split(" - ")[1]}`);
  
    return groupedRanges;
  };
  
  // Toggle time selection
  const handleTimeSelect = (time) => {
    if (bookedTimes.includes(time)) {
      setModalMessage(`${time} is already booked.`);
      setIsModalOpen(true); // Open the modal instead of alert
      return;
    }
  
    setSelectedTimes((prev) => {
      const updatedTimes = [...prev];
      const timeIndex = predefinedTimes.indexOf(time);
  
      if (updatedTimes.includes(time)) {
        // Deselect time and all subsequent times
        const timeToRemoveIndex = updatedTimes.indexOf(time);
        return updatedTimes.slice(0, timeToRemoveIndex);
      } else {
        // Add time and intermediate times
        updatedTimes.push(time);
        updatedTimes.sort(
          (a, b) => predefinedTimes.indexOf(a) - predefinedTimes.indexOf(b)
        );
  
        const startIndex = predefinedTimes.indexOf(updatedTimes[0]);
        const endIndex = predefinedTimes.indexOf(updatedTimes[updatedTimes.length - 1]);
  
        for (let i = startIndex; i <= endIndex; i++) {
          if (!updatedTimes.includes(predefinedTimes[i])) {
            if (bookedTimes.includes(predefinedTimes[i])) {
              //setModalMessage(`${predefinedTimes[i]} is already booked. Cannot select range.`);
              setModalMessage(`The time range cannot be selected because some slots within this range are already reserved.`);
              setIsModalOpen(true); // Open the modal
              return prev; // Prevent selection if any intermediate slot is booked
            }
            updatedTimes.push(predefinedTimes[i]);
          }
        }
  
        updatedTimes.sort(
          (a, b) => predefinedTimes.indexOf(a) - predefinedTimes.indexOf(b)
        );
        return updatedTimes;
      }
    });
  };

  // Proceed to confirmation
  const handleProceed = () => {
    if (!selectedDate || selectedTimes.length === 0) {
      setModalMessage("Please select both a date and at least one time slot.");
      setIsModalOpen(true); // Open the modal if conditions aren't met
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

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bookingitemhistory-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {isModalOpen && <Modal message={modalMessage} onClose={closeModal} />}

      <div
        className="bookcourt-banner"
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
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              //min={new Date().toISOString().split("T")[0]} // Restrict to current and future dates
              min={new Date().toLocaleDateString('en-CA')} // Restrict to current and future dates
            />
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
                    disabled={bookedTimes.includes(time)} // Disable if already booked
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
                <p>{selectedTimes.length > 0 ? groupTimes(selectedTimes).join(", ") : "Not selected"}</p>
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
