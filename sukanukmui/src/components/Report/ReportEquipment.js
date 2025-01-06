import React, { useState, useEffect } from "react";
import {
  Chart,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./ReportEquipment.css";

// Register required Chart.js components and plugins
Chart.register(
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ReportEquipment = () => {
  
  // Function to format date to dd/mm/yyyy
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear(); // Full year (4 digits)
    return `${day}/${month}/${year}`;
  };

  const [graphType, setGraphType] = useState("totalBookings");
  const [timeFilter, setTimeFilter] = useState("this week");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings data from API
  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reportbookingequipment");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  

  // Calculate Equipment Usage
  const equipmentCounts = bookings.reduce((acc, booking) => {
    acc[booking.ItemName] = (acc[booking.ItemName] || 0) + 1;
    return acc;
  }, {});
  const equipmentNames = Object.keys(equipmentCounts);
  const equipmentBookings = Object.values(equipmentCounts);

  // Helper function to get the filtered bookings
  const getFilteredBookings = () => {
    const today = new Date();
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.BookingDate);
      if (timeFilter === "last week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7); // Start of the last week
        return bookingDate >= oneWeekAgo && bookingDate <= today;
      }
      else if (timeFilter === "last month") {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // First day of last month
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
        return bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth;
      } 
      else if (timeFilter === "this month") {
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of this month
        const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of this month
        return bookingDate >= startOfThisMonth && bookingDate <= endOfThisMonth;
      } 
      else if (timeFilter === "this week") {
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Normalize to midnight
        const sevenDaysLater = new Date(startOfToday);
        sevenDaysLater.setDate(startOfToday.getDate() + 7); // 7 days after today
  
  return bookingDate >= startOfToday && bookingDate < sevenDaysLater;
      } 
      return true; // Default: return all bookings
    });
    return filteredBookings;
  };

    // Helper function to get filtered upcoming returns
  const getFilteredUpcomingReturns = () => {
    const today = new Date();
    return bookings
      .filter((booking) => new Date(booking.BookingItemReturnedDate) >= today)
      .sort((a, b) => new Date(a.BookingItemReturnedDate) - new Date(b.BookingItemReturnedDate));
  };
  
  // Dynamically calculate totalBookings based on the filter
  const filteredBookings = getFilteredBookings();
  const totalBookings = filteredBookings.length;

  // Generate data for the Daily Equipment Bookings Line Graph
  const generateDailyBookingsData = () => {
  const filteredBookings = getFilteredBookings();
  const dailyCounts = {};

  filteredBookings.forEach((booking) => {
    const formattedDate = formatDate(booking.BookingDate);
    dailyCounts[formattedDate] = (dailyCounts[formattedDate] || 0) + 1;
  });

  // Count the number of bookings for each date
  filteredBookings.forEach((booking) => {
    const formattedDate = formatDate(booking.BookingDate);
    dailyCounts[formattedDate] = (dailyCounts[formattedDate] || 0) ;
  });

  // Sort dates and prepare data for the graph
  const sortedDates = Object.keys(dailyCounts).sort((a, b) => new Date(a) - new Date(b));
  const dailyData = sortedDates.map((date) => dailyCounts[date]);

  return {
    labels: sortedDates,
    datasets: [
      {
        label: "Daily Equipment Bookings",
        data: dailyData,
        backgroundColor: "rgba(78, 115, 223, 0.6)",
        borderColor: "#4E7CFF",
        borderWidth: 2,
      },
    ],
  };
};

// Generate data for Doughnut and Bar Graphs based on filtered bookings
const generateEquipmentUsageData = () => {
  const filteredBookings = getFilteredBookings();
  const equipmentCounts = filteredBookings.reduce((acc, booking) => {
    acc[booking.ItemName] = (acc[booking.ItemName] || 0) + booking.BookingItemQuantity;
    return acc;
  }, {});
  const equipmentNames = Object.keys(equipmentCounts);
  const equipmentBookings = Object.values(equipmentCounts);

  return { equipmentNames, equipmentBookings };
};

const { equipmentNames: filteredEquipmentNames, equipmentBookings: filteredEquipmentBookings } =
  generateEquipmentUsageData();
const bookingTrendsData = generateDailyBookingsData();

const doughnutData = {
  labels: filteredEquipmentNames,
  datasets: [
    {
      label: "Equipment Usage",
      data: filteredEquipmentBookings,
      backgroundColor: ["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7"],
    },
  ],
};

const barData = {
  labels: filteredEquipmentNames,
  datasets: [
    {
      label: "Total Equipment Quantity Booked",
      data: filteredEquipmentBookings,
      backgroundColor: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"],
    },
  ],
};

//Line Options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Date",
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      y: {
        grid: {
          display: true,
        },
        title: {
          display: true,
          text: "Number of Bookings",
          color: "#333",
          font: {
            size: 14,
          },
        },
      ticks: {
        stepSize: 1, // Increment by 1
        callback: function (value) {
          return Math.round(value); // Ensure all ticks are rounded
        },
      },
      beginAtZero: true, // Ensure the y-axis starts at 0
    },
  },
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };

  // Bar Options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Equipment Type",
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      y: {
        grid: {
          display: true,
        },
        title: {
          display: true,
          text: "Total Usage",
          color: "#333",
          font: {
            size: 14,
          },
        },
        ticks: {
          beginAtZero: true, // Ensure the scale starts at 0
          callback: (value) => Math.round(value), // Round each tick value
          stepSize: 1, // Set a fixed step size of 1
        },
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };

  //Doughnut Options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
          return ((value / total) * 100).toFixed(2) + "%";
        },
        color: "#fff",
        font: {
          size: 14,
        },
      },
    },
  };

  const renderUpcomingReturnsTable = () => {
    const upcomingReturns = getFilteredUpcomingReturns();
    return (
      <div className="table-container1">
        <h3>Upcoming Returns</h3>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Student Name</th>
              <th>Item Name</th>
              <th>Item Quantity</th>
              <th>Booking Date</th>
              <th>Booking Item Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {upcomingReturns.map((booking) => (
              <tr key={booking.BookingItemID}>
                <td>{booking.BookingItemID}</td>
                <td>{booking.StudentName}</td>
                <td>{booking.ItemName}</td>
                <td>{booking.BookingItemQuantity}</td>
                <td>{formatDate(booking.BookingDate)}</td>
                <td>{formatDate(booking.BookingItemDate)}</td>
                <td>{formatDate(booking.BookingItemReturnedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  //Graph Rendering
  const renderGraph = () => {
    switch (graphType) {
      case "totalBookings":
        return (
          <div className="side-by-side-charts">
            <div className="chart-container">
              <Line data={bookingTrendsData} options={lineOptions} />
            </div>
            <div className="chart-container">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        );
      case "totalEquipment":
        return (
          <div className="chart-container">
          <Bar data={barData} options={barOptions} />
          </div>
        );
      case "upcomingReturns":
        return renderUpcomingReturnsTable();
      default:
        return null;
    }
  };

  // Function to sort filtered bookings
  const getSortedBookings = () => {
    const filteredBookings = getFilteredBookings();
    return filteredBookings.sort((a, b) => new Date(a.BookingDate) - new Date(b.BookingDate));
  };

  // Table rendering
  const renderTable = () => {
    const sortedBookings = getSortedBookings();
    return (
      <div className="table-container">
        <h3>Bookings</h3>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Student Name</th>
              <th>Item Name</th>
              <th>Item Quantity</th>
              <th>Booking Date</th>
              <th>Booking Item Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking) => (
              <tr key={booking.BookingItemID}>
                <td>{booking.BookingItemID}</td>
                <td>{booking.StudentName}</td>
                <td>{booking.ItemName}</td>
                <td>{booking.BookingItemQuantity}</td>
                <td>{formatDate(booking.BookingDate)}</td>
                <td>{formatDate(booking.BookingItemDate)}</td>
                <td>{formatDate(booking.BookingItemReturnedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="report-equipment">
      {/* Filter Section */}
      {graphType !== "upcomingReturns" && (
      <div className="filter-section">
       <label htmlFor="time-filter" className="filter-label">Filter by:</label>
       <div className="filter-dropdown">
    <select
      id="time-filter"
      value={timeFilter}
      onChange={(e) => setTimeFilter(e.target.value)}
      className="filter-select"
    >
      <option value="last week">Last Week</option>
      <option value="this week">This Week</option>
      <option value="last month">Last Month</option>
      <option value="this month">This Month</option>
    </select>
  </div>
  </div>
      )}
      {/* Cards */}
      <div className="main-cards">
        <div className="card blue" onClick={() => setGraphType("totalBookings")}>
          <h2>TOTAL BOOKINGS</h2>
          <p>{totalBookings}</p>
        </div>
        <div className="card orange" onClick={() => setGraphType("totalEquipment")}>
          <h2>TOTAL EQUIPMENT</h2>
          <p>{equipmentNames.length}</p>
        </div>
        <div className="card red" onClick={() => setGraphType("upcomingReturns")}>
          <h2>UPCOMING RETURNS</h2>
          <p>{getFilteredUpcomingReturns().length}</p>
        </div>
      </div>

      {/* Graph Area */}
      <div className="charts">
        <div className="charts-card">{renderGraph()}</div>
      </div>

     {/* Table Section */}
     {graphType === "totalBookings" && "totalEquipment" && renderTable()}
     </div>
  );
};

export default ReportEquipment;