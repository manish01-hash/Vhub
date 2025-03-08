import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import AdminCreateEvent from "./pages/admin/AdminCreateEvent";
import AdminEditEvent from "./pages/admin/AdminEditEvent";
import EventSpecificVolunteers from "./pages/admin/EventSpecificVolunteers";
import AddTaskModal from "./pages/admin/AddTaskModal";
import ViewTasks from "./pages/admin/ViewTasks";
import AboutUs from "./pages/admin/AboutUs";
import ContactUs from "./pages/admin/ContactUs";

// ✅ Get user role from localStorage
const userRole = localStorage.getItem("userRole") || "Volunteer";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}> 
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/events/create" element={<AdminCreateEvent />} />  {/* ✅ Added */}
          <Route path="/admin/events/edit/:eventId" element={<AdminEditEvent />} />  {/* ✅ Added */}
          <Route path="/admin/volunteers" element={<AdminVolunteers />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/event-specific-volunteers" element={<EventSpecificVolunteers />} />
          <Route path="/admin/add-task" element={<AddTaskModal />} />
          <Route path="/admin/view-tasks" element={<ViewTasks />} />
          <Route path="/admin/about-us" element={<AboutUs />} />
          <Route path="/admin/contact-us" element={<ContactUs />} />

        </Route>

        {/* Protected Routes for Volunteers */}
        <Route element={<ProtectedRoute allowedRoles={["Volunteer"]} />}> 
          <Route path="/volunteer-dashboard" element={<AllEvents />} />
        </Route>

        {/* Protected Routes for Event Organizers */}
        <Route element={<ProtectedRoute allowedRoles={["Event Organizer"]} />}> 
          <Route path="/organizer-dashboard" element={<EventPost />} />
        </Route>

        {/* Common Routes for Events */}
        <Route path="/events" element={<EventPost />} />
        <Route path="/events/:eventId/register" element={<EventRegistration />} />
        <Route path="/events/:eventId" element={<EventDetails />} />

        {/* Other Routes */}
        <Route path="/certificate" element={<CertificateDownload />} />
        <Route path="/qr-scanner" element={<QRCodeScanner />} />

        {/* Catch All - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
