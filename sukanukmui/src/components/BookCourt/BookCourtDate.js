import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookCourtDate.css'; // Import CSS file for styling

const BookCourtDate = () => {
  const { venueId } = useParams(); // Extract venueId from URL
  const navigate = useNavigate();

  const [venueDetails, setVenueDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch venue details
  useEffect(() => {
    fetch(`http://localhost:5000/api/courts/${venueId}`)
      .then((res) => res.json())
      .then((data) => setVenueDetails(data))
      .catch((error) => console.error('Error fetching venue details:', error));
  }, [venueId]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetch(`http://localhost:5000/api/availability/${venueId}?date=${date}`)
      .then((res) => res.json())
      .then((data) => setAvailableTimes(data))
      .catch((error) => console.error('Error fetching available times:', error));
  };

  const handleTimeSelect = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleProceed = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both a date and time.');
      return;
    }
    navigate('/confirmation', {
      state: {
        venue: venueDetails,
        date: selectedDate,
        time: selectedTime,
      },
    });
  };

  return (
    <div className="book-court-container">
      <h1>Book to Play</h1>

      <div className="booking-steps">
        <div className="step active">Booking Details</div>
        <div className="step">Confirmation</div>
        <div className="step">Done</div>
      </div>

      {venueDetails && (
        <div className="booking-details-container">
          <div className="booking-form">
            <h3>1. Select a date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <h3>2. Select a time</h3>
            <select value={selectedTime} onChange={handleTimeSelect}>
              <option value="">Select available time</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="my-cart">
            <h3>My Cart</h3>
            <img
              src={`http://localhost:5000/images/${venueDetails.CourtPic}`}
              alt={venueDetails.CourtName}
            />
            <p><strong>{venueDetails.CourtName}</strong></p>
            <p>{venueDetails.CourtDescription}</p>
            <p><strong>Date:</strong> {selectedDate || 'Not selected'}</p>
            <p><strong>Time:</strong> {selectedTime || 'Not selected'}</p>
            <button
              className="proceed-button"
              onClick={handleProceed}
              disabled={!selectedDate || !selectedTime}
            >
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCourtDate;
