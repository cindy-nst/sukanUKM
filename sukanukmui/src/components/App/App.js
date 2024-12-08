import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import HomePage from '../HomePage/HomePage';
import Venues from '../Venues/Venues';
import SportEquipment from '../SportEquipment/SportEquipment';
import EditEquipment from '../EditSportEquipment/EditEquipment';
import CourtDetail from '../Venues/CourtDetail';
import Profile from '../Profile/Profile';
import Navbar from '../Navbar';
import AddVenue from '../Venues/AddVenue';
import BookCourt from '../BookCourt/BookCourt';
import BookCourtDate from '../BookCourt/BookCourtDate';
import BookEquipmentDateTime from '../BookEquipment/BookEquipmentDateTime';
import BookEquipmentConfirmation from '../BookEquipment/BookEquipmentConfirmation';
import BookConfirmation from '../BookCourt/BookConfirmation';
import BookEquipmentDone from '../BookEquipment/BookEquipmentDone';
import BookDone from '../BookCourt/BookingDone';
import EditVenue from '../Venues/EditVenue';
import AddSportEquipment from '../SportEquipment/AddSportEquipement';
import EquipmentDetails from '../EditSportEquipment/EquipmentDetails';
import BookEquipment from '../SportEquipment/BookEquipment';
import ReportPage from '../Report/ReportPage';
import ReportVenues from '../Report/ReportVenues';
import ReportEquipment from '../Report/ReportEquipment';
import BookingHistory from '../History/BookingHistory';
import BookingHistoryDetail from '../History/BookingHistoryDetail';
import BookingItemHistory from '../History/BookingItemHistory';
import HistoryPage from '../History/HistoryPage';

import { UserContext } from '../UserContext'; // Assuming this is where your UserContext is defined

import './App.css';

function App() {
  const { user } = useContext(UserContext); // Access user data from context

  return (
    <div className="App">
      {/* Render Navbar only if the user is logged in */}
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/sportequipment" element={<SportEquipment/>} />
        <Route path="/equipment/:ItemID" element={<EditEquipment />} />
        <Route path="/courts/:id" element={<CourtDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-venue" element={<AddVenue />} />
        <Route path="/book-court" element={<BookCourt />} />
        <Route path="/book/:CourtID" element={<BookCourtDate />} />
        <Route path="/book-equipment/:ItemID" element={<BookEquipmentDateTime />} />
        <Route path="/book-equipment-confirmation/:ItemID" element={<BookEquipmentConfirmation />} />
        <Route path="/book-equipment-done/:ItemID" element={<BookEquipmentDone />} />
        <Route path="/book-confirmation/:CourtID" element={<BookConfirmation />} />
        <Route path="/book-done/:CourtID" element={<BookDone />} />
        <Route path="/edit-venue/:CourtID" element={<EditVenue />} />
        <Route path="/add-sportequipment" element={<AddSportEquipment />} />
        <Route path="/equipment/details/:ItemID" element={<EquipmentDetails />} />
        <Route path="/book-equipment" element={<BookEquipment />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/report-venue" element={<ReportVenues />} />
        <Route path="/report-equipment" element={<ReportEquipment />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/booking-history-detail/:BookingID" element={<BookingHistoryDetail />} />
        <Route path="/booking-item-history" element={<BookingItemHistory />} />

        <Route path="/historypage" element={<HistoryPage />} />

        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
