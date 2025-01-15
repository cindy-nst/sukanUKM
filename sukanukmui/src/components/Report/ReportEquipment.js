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
  const [selectedEquipment, setSelectedEquipment] = useState("All Equipments");
  const [timeFilter, setTimeFilter] = useState("this week");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Months are 1-indexed
  

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
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.BookingDate);
      return (
        bookingDate.getFullYear() === selectedYear &&
        bookingDate.getMonth() + 1 === selectedMonth
      );
    });
  };
  
    // Helper function to filter bookings by selected equipment
  const equipments = ["All Equipments", ...new Set(bookings.map((booking) => booking.ItemName))];

const getFilteredBookingsByEquipment = () => {
  const timeFilteredBookings = getFilteredBookings();
  if (selectedEquipment === "All Equipments") {
    return timeFilteredBookings;
  }
  return timeFilteredBookings.filter((booking) => booking.ItemName === selectedEquipment);
};

  // Generate Line Graph Data
  const generateLineGraphData = () => {
    const filteredBookingsByEquipment = getFilteredBookingsByEquipment();

        // Extract unique booking dates and sum the quantities of equipment booked for each date
      const dateCounts = filteredBookingsByEquipment.reduce((acc, booking) => {
      const bookingDate = booking.BookingDate;
      acc[bookingDate] = (acc[bookingDate] || 0) + booking.BookingItemQuantity;
      return acc;
    }, {});

  // Prepare labels and data for the line graph
     const labels = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b)); // Dates in order
     const data = labels.map((date) => dateCounts[date]);

    return {
      labels,
      datasets: [
        {
        label: `Quantity of ${selectedEquipment} Booked`,
        data,
        backgroundColor: "rgba(78, 115, 223, 0.6)",
        borderColor: "#4E7CFF",
        borderWidth: 2,
        },
       ],
     };
    };
    
      const lineGraphData = generateLineGraphData();

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

  const lineGraphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid:{
          display:false
        },
        title: {
          display: true,
          text: "Booking Date",
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Quantity of Equipment",
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
        suggestedMax: function (ctx) {
          // Dynamically calculate the max scale value
          const maxValue = Math.max(...ctx.chart.data.datasets[0].data) || 0;
          return maxValue + 1;
        },
      },
    },
    plugins: {
      datalabels: {
        display: false,
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
          <div className="side-by-side-charts">
        <div className="chart-container">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="chart-container1">
          <div className="filter-section1">
            <label htmlFor="equipment-filter" className="filter-label1">Select Equipment:</label>
            <div className="filter-dropdown">
              <select
                id="equipment-filter"
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="filter-select1"
              >
                {equipments.map((equipment) => (
                  <option key={equipment} value={equipment}>
                    {equipment}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="line-chart-container">
          <Line data={lineGraphData} options={lineGraphOptions} />
          </div>
        </div>
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
      <label htmlFor="year-filter" className="filter-label">Select Year:</label>
      <div className="filter-dropdown">
        <select
          id="year-filter"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="filter-select"
        >
          {Array.from({ length: 2 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <label htmlFor="month-filter" className="filter-label">Select Month:</label>
      <div className="filter-dropdown">
        <select
          id="month-filter"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="filter-select"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
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