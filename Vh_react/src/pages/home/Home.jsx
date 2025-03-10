import React, { useState } from "react";
import { FaBars, FaCalendarCheck, FaClipboardList, FaEnvelope, FaHome, FaInfoCircle, FaSignInAlt, FaSignOutAlt, FaTasks, FaUser, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile";
import AllEvents from "../AllEvents";
import { useAuth } from "../../context/AuthContext";
import AboutUs from "../admin/AboutUs";
import "./home.css";
import ContactUs from "../admin/ContactUs";

function Home() {
    const { user, logout } = useAuth();
    const username = user ? user.username : "Guest";
    const navigate = useNavigate(); 
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activePage, setActivePage] = useState("home");

    return (
        <div className="w-full min-h-screen flex bg-[#1a202c] text-white">
            {/* Sidebar */}
            <div className={`min-h-screen bg-[#1a202c] flex flex-col p-4 shadow-lg transition-all ${isCollapsed ? "w-20" : "w-64"}`}>
                {/* Sidebar Toggle Button */}
                <button 
                    className="mb-6 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <FaBars size={20} />
                </button>

                {/* Sidebar Links */}
                {[
                    { name: "home", label: "Home", icon: <FaHome size={24} /> },
                    { name: "events", label: "My Events", icon: <FaCalendarCheck size={24} /> },
                    { name: "community", label: "Community", icon: <FaUsers size={24} /> },
                    { name: "about", label: "About Us", icon: <FaInfoCircle size={24} /> },
                    { name: "contact", label: "Contact", icon: <FaEnvelope size={24} /> },
                    { name: "profile", label: "My Profile", icon: <FaUser size={24} /> }
                ].map(({ name, label, icon }) => (
                    <div 
                        key={name}
                        className={`flex items-center space-x-3 text-lg cursor-pointer p-3 rounded-md transition ${
                            activePage === name ? "bg-green-500 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                        onClick={() => setActivePage(name)}
                    >
                        {icon}
                        {!isCollapsed && <span>{label}</span>}
                    </div>
                ))}

                {/* Logout Button */}
                <button 
                    onClick={() => {
                        console.log("🔴 Logout Clicked");
                        logout();
                        navigate('/login');
                    }} 
                    className="mt-auto flex items-center justify-center p-3 bg-red-500 hover:bg-red-700 rounded-md text-white transition"
                >
                    <FaSignOutAlt size={20} /> {!isCollapsed && <span className="ml-2">Logout</span>}
                </button>
            </div>

            {/* Main Content */}
            <div className="w-full flex flex-col">
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                    {activePage === "home" && (
                        <>
                            <img className="rounded-xl" src="https://img.freepik.com/free-vector/people-volunteering-donating-money_53876-66112.jpg" alt="" />
                            <h2 className="text-4xl font-bold">Join Our Volunteer Community</h2>
                            <p className="text-lg mt-4">Be part of something meaningful. Register, manage events, and contribute to a better world!</p>
                        </>
                    )}
                    {activePage === "profile" && <Profile />}
                    {activePage === "events" && <AllEvents />}
                    
                    {activePage === "community" && <h2 className="text-3xl font-bold">Community Engagement</h2>}
                    {activePage === "about" && <AboutUs/>}
                    {activePage === "contact" && <ContactUs/>}
                </div>
            </div>
        </div>
    );
}

export default Home;
