import React, { useState, useEffect } from "react";
import "./ReportVenues.css";

const ReportVenues = () => {
  const [bookings, setBookings] = useState([]); // Holds the booking data
  const [selectedDate, setSelectedDate] = useState(""); // Holds the selected date
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // For showing a loading spinner

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch("http://localhost:5000/api/bookingcourt"); // Replace with your API endpoint
        const data = await response.json();
        console.log("Fetched bookings:", data); // Log the entire bookings data
        setBookings(data); // Set the fetched bookings
        setLoading(false); // End loading
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Update selected date
    setCurrentPage(1); // Reset to the first page on date change
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page whenever rows per page change
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString); // Parse the ISO date string
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Filter bookings based on selected date
  const filteredBookings = bookings.filter((booking) => {
    return (
      !selectedDate || // If no date is selected, return all bookings
      booking.BookingCourtDate === selectedDate // Compare selected date with booking date
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentBookings = filteredBookings.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="report-container">
      <div className="report-banner">
        <h1>Venue Booking Report</h1>
      </div>

      <div className="filter-container">
        <label>
          Show List:
          <select value={rowsPerPage} onChange={handleRowsChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </label>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="report-table-container">
          <table className="table-container">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Name</th>
                <th>Court</th>
                <th>Booking Time</th>
                <th>Date Booked</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((b) => (
                <tr key={b.BookingCourtID}>
                  <td>{b.BookingCourtID}</td>
                  <td>{b.StudentName}</td>
                  <td>{b.CourtName}</td>
                  <td>{b.BookingCourtTime}</td>
                  <td>{b.BookingCourtDate}</td>
                  <td>
                    <a href={`mailto:${b.StudentEmail}`}>
                      {b.StudentEmail}
                    </a>
                  </td>
                  <td>{b.StudentPhoneNumber}</td>
                  <td>{formatDateToDDMMYYYY(b.BookingDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportVenues;
