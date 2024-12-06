import React, { useState } from "react";
import "./ReportVenues.css";

const ReportVenues = () => {

  const [selectedDate, setSelectedDate] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data for venue bookings
  const venueBookings = [
    {
      bookingID: "21102",
      name: "Muhammad Akmal",
      equipment: "Badminton Racket",
      dateBooked: "3/10/2024",
      returnBooked: "5/10/2024",
      quantity: "2",
      email: "akmal@siswa.ukm.edu.my",
      phone: "0192345678",
    },
    {
      bookingID: "31200",
      name: "Sarah Ali",
      equipment: "Badminton Racket",
      dateBooked: "3/10/2024",
      returnBooked: "5/10/2024",
      quantity: "2",
      email: "sarah@siswa.ukm.edu.my",
      phone: "0187643521",
    },
    {
      bookingID: "21152",
      name: "Kamarul",
      equipment: "Badminton Racket",
      dateBooked: "3/10/2024",
      returnBooked: "5/10/2024",
      quantity: "2",
      email: "kamarul@siswa.ukm.edu.my",
      phone: "0163452231",
    },    
    {
      bookingID: "21302",
      name: "Aisyah",
      equipment: "Badminton Racket",
      dateBooked: "3/10/2024",
      returnBooked: "5/10/2024",
      quantity: "2",
      email: "aisyah@siswa.ukm.edu.my",
      phone: "0132567543",
    },
    {
      bookingID: "21342",
      name: "Zaki",
      equipment: "Badminton Racket",
      dateBooked: "3/10/2024",
      returnBooked: "5/10/2024",
      quantity: "2",
      email: "Zaki@siswa.ukm.edu.my",
      phone: "013209817",
    },
    {
      bookingID: "55555",
      name: "Bunga",
      equipment: "Badminton Racket",
      dateBooked: "3/10/2024",
      returnBooked: "5/10/2024",
      quantity: "2",
      email: "bunga@siswa.ukm.edu.my",
      phone: "0154326789",
    },
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to the first page on date change
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page whenever rows per page change
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filtered bookings by date
  const filteredBookings = venueBookings.filter(
    (booking) => !filterDate || booking.dateBooked === filterDate
  );

    // Pagination logic
    const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentBookings = filteredBookings.slice(startIndex, startIndex + rowsPerPage);

    return (
      <div className="report-container">
        {/* Banner Section */}
        <div className="report-banner">
          <h1>Venue Booking Report</h1>
        </div>
  
        {/* Filter Section */}
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
  
        {/* Table Section */}
        <div className="report-table-container">
          <table className="table-container">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Name</th>
                <th>Equipment</th>
                <th>Date Booked</th>
                <th>Return Booked</th>
                <th>Quantity</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking) => (
                <tr key={booking.bookingID}>
                  <td>{booking.bookingID}</td>
                  <td>{booking.name}</td>
                  <td>{booking.equipment}</td>
                  <td>{booking.dateBooked}</td>
                  <td>{booking.returnBooked}</td>
                  <td>{booking.quantity}</td>
                  <td>
                    <a href={`mailto:${booking.email}`}>{booking.email}</a>
                  </td>
                  <td>{booking.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Pagination Section */}
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
