import React, { useEffect, useState } from 'react';
import './BookingHistoryDetail.css';
import { useParams } from 'react-router-dom';

const BookingHistoryDetail = () => {
  const { BookingID } = useParams(); // Get the BookingID from the route
  const [bookingDetail, setBookingDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching booking details using the BookingID
    const fetchBookingDetail = async () => {
      try {
        // Dummy data for booking history
  const mockData = [
    {
      BookingID: 1,
      Image: "futsal_court.jpg",
      Title: "KPZ Court Futsal",
      Date: "30 Oct 2024",
      Venue: "Venue: KPZ Court Futsal"
    },
    {
      BookingID: 2,
      Image: "futsal_court.jpg",
      Title: "KPZ Court Futsal",
      Date: "19 Oct 2024",
      Venue: "Venue: KPZ Court Futsal"
    },
    {
      BookingID: 3,
      Image: "outdoor_court.jpg",
      Title: "Gelanggang Serbaguna UKM (Outdoor)",
      Date: "11 Oct 2024",
      Venue: "Venue: Gelanggang Serbaguna UKM (Outdoor)"
    },
    {
      BookingID: 4,
      Image: "handball.jpg",
      Title: "Handball Molten Size 3",
      Date: "27 Sept 2024",
      Venue: "Equipment: Handball Molten Size 3"
    },
    {
      BookingID: 5,
      Image: "badminton_racket.jpg",
      Title: "Badminton Racket",
      Date: "10 Sept 2024",
      Venue: "Equipment: Badminton Racket"
    },
    {
      BookingID: 6,
      Image: "stadium_ukm.jpg",
      Title: "Stadium UKM",
      Date: "17 Oct 2023",
      Venue: "Venue: Stadium UKM"
    },
  ];

        // Find the booking detail by BookingID
        const detail = mockData.find((booking) => booking.BookingID === BookingID);

        if (detail) {
          setBookingDetail(detail);
        } else {
          setError('Booking detail not found.');
        }
      } catch (err) {
        setError('Failed to fetch booking details.');
      }
    };

    fetchBookingDetail();
  }, [BookingID]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!bookingDetail) {
    return <div className="loading">Loading booking details...</div>;
  }

  return (
    <div className="booking-detail-container">
      <h1>Booking History</h1>
      <h2>Your Booking Detail</h2>
      <div className="booking-detail-card">
        <h3>Booking Details</h3>
        <p><strong>Venue:</strong> {bookingDetail.venue}</p>
        <a href={bookingDetail.mapLink} target="_blank" rel="noopener noreferrer">View on Map</a>
        <p><strong>Date:</strong> {bookingDetail.date}</p>
        <p><strong>Time:</strong></p>
        <ul>
          {bookingDetail.timeSlots.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
        <p><strong>Student:</strong> {bookingDetail.studentName}</p>
        <p><strong>Confirmation ID:</strong> {bookingDetail.confirmationId}</p>
      </div>
    </div>
  );
};

export default BookingHistoryDetail;