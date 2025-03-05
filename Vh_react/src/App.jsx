import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import ProtectedRoute from "../src/components/ProtectedRoute";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import AllEvents from "./pages/AllEvents";
import AdminDashboard from "./pages/AdminDashboard";
import Events from "./pages/Events";
import CertificateDownload from "../src/pages/CertificateDownload";
import QRCodeScanner from "../src/pages/QRCodeScanner";
import Unauthorized from "./pages/Unauthorized";
import Home from "./pages/home/Home";
import SidebarLayout from "./components/SidebarLayout";

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
        </Route>
        <Route path="/events" element={<Events />} />
        <Route path="/certificate" element={<CertificateDownload />} />
        <Route path="/qr-scanner" element={<QRCodeScanner />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
