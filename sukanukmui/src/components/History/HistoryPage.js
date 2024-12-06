import React from "react";
import "./HistoryPage.css";
import { useNavigate } from "react-router-dom";

import court from "../../images/KPZFutsalCourt.jpg";
import equipment from "../../images/equipment.jpg";

const HistoryPage = () => {
  const navigate = useNavigate(); // Initialize the navigation hook

  // Handlers for navigating to different pages
  const handleVenueNavigation = () => {
    navigate("/report-venue");
  };

  const handleEquipmentNavigation = () => {
    navigate("/report-equipment");
  };


  return (
    <div className="report-container">
      {/* Banner Section */}
      <div className="report-banner">
        <h1>Booking History</h1>
      </div>

      {/* Report Cards Section */}
      <div className="report-grid">
        {/* Venue Card */}
        <div 
        className="report-card"
        onClick={handleVenueNavigation} // Navigate to the Venue Report page
        >
          <div className="report-image">
          <img src={court} alt="Venue" />
          </div>
          <h2 className="report-name">Venues</h2>
        </div>

        {/* Equipment Card */}
        <div 
        className="report-card"
        onClick={handleEquipmentNavigation} // Navigate to the Equipment Report page
        >
          <div className="report-image">
          <img src={equipment} alt="Equipment" />
          </div>
          <h2 className="report-name">Equipments</h2>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
