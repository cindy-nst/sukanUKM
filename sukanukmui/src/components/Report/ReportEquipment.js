import React, { useState, useEffect } from "react";
import "./ReportEquipment.css";

// Helper function to format the date in dd-mm-yyyy format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ReportEquipment = () => {
  const [equipmentBookings, setEquipmentBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipmentBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/bookingequipment");
        const data = await response.json();
        console.log("Fetched equipment bookings:", data); // Log the fetched data
        setEquipmentBookings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching equipment bookings:", error);
        setLoading(false);
      }
    };

    fetchEquipmentBookings();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to the first page when a new date is selected
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when rows per page is changed
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filter bookings based on selected date
  const filteredEquipmentBookings = equipmentBookings.filter((booking) => {
    // If no date is selected, return all bookings
    if (!selectedDate) {
      return true;
    }
    // Otherwise, compare booking date with selected date
    return booking.BookingItemDate === selectedDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEquipmentBookings.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentEquipmentBookings = filteredEquipmentBookings.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="report-container">
      <div className="report-banner">
        <h1>Sport Equipment Booking Report</h1>
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
                <th>Equipment Name</th>
                <th>Quantity</th>
                <th>Booking Date</th>
                <th>Return Date</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {currentEquipmentBookings.map((bse) => {
                console.log("Booking data:", bse); // Check the data
                return (
                  <tr key={bse.BookingItemID}>
                    <td>{bse.BookingItemID}</td>
                    <td>{bse.ItemName}</td>
                    <td>{bse.BookingItemQuantity}</td>
                    <td>{formatDate(bse.BookingItemDate)}</td> {/* Apply date format */}
                    <td>{formatDate(bse.BookingItemReturnedDate)}</td> {/* Apply date format */}
                    <td>{bse.StudentName || "N/A"}</td>
                    <td>
                      <a href={`mailto:${bse.StudentEmail}`}>{bse.StudentEmail || "N/A"}</a>
                    </td>
                    <td>{bse.StudentPhoneNumber || "N/A"}</td>
                  </tr>
                );
              })}
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

export default ReportEquipment;
