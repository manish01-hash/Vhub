import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import ProtectedRoute from "../src/components/ProtectedRoute";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import AllEvents from "./pages/AllEvents";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import CertificateDownload from "../src/pages/CertificateDownload";
import QRCodeScanner from "../src/pages/QRCodeScanner";
import Unauthorized from "./pages/Unauthorized";
import Home from "./pages/home/Home";
import SidebarLayout from "./components/SidebarLayout";
import EventPost from "./pages/EventPost";
import AdminVolunteers from "./pages/admin/AdminVolunteers";
import AdminAttendance from "./pages/admin/AdminAttendance"; 
import EventRegistration from "./pages/EventRegistration";
import EventDetails from "./pages/EventDetails";




function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/volunteer-dashboard" element={<AllEvents />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
        </Route>
        <Route path="/events" element={<EventPost />} />
        <Route path="/certificate" element={<CertificateDownload />} />
        <Route path="/qr-scanner" element={<QRCodeScanner />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/volunteers" element={<AdminVolunteers />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/events/:eventId/register" element={<EventRegistration />} />
        <Route path="/events/:eventId" element={<EventDetails />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;
