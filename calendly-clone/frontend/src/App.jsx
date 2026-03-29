import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EventTypes from './pages/EventTypes';
import Availability from './pages/Availability';
import Meetings from './pages/Meetings';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/Login';

import './index.css';

export default function App() {
  // ✅ Read directly — no useEffect race condition
  const [user, setUser] = useState(() => localStorage.getItem('name'));

  // ✅ FIX: reactively read localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('name');
    setUser(storedUser);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout */}
        <Route path="/" element={<Layout />}>

          {/* Default redirect */}
          <Route index element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />

          {/* Protected Routes */}
          <Route path="dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="event-types" element={user ? <EventTypes /> : <Navigate to="/login" />} />
          <Route path="availability" element={user ? <Availability /> : <Navigate to="/login" />} />
          <Route path="meetings" element={user ? <Meetings /> : <Navigate to="/login" />} />

        </Route>

        {/* Public booking */}
        <Route path="/:username/:slug" element={<BookingPage />} />
        <Route path="/booking/confirmed" element={<BookingConfirmation />} />

      </Routes>
    </BrowserRouter>
  );
}