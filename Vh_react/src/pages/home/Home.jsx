import React, { useState } from "react";
import { FaClipboardList, FaEnvelope, FaHome, FaInfoCircle, FaSignInAlt, FaUser, FaUsers, FaCalendarCheck, FaTasks, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile";
import "./home.css";
import { useAuth } from "../../context/AuthContext";
import SidebarIcon from "../../components/icons/SidebarIcon";
import AllEvents from "../AllEvents";

function Home() {
    const { user, logout } = useAuth();
    const username = user ? user.username : "Guest";
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("home");
    const [isCollapsed, setIsCollapsed] = useState(false); // ✅ Sidebar toggle

    return (
        <div className="w-full min-h-screen flex bg-[#1a202c] text-white">
            {/* ✅ Sidebar (Consistent for all pages) */}
            <div 
                className={`min-h-screen bg-[#2d3748] flex flex-col justify-around p-6 shadow-lg transition-all ${isCollapsed ? "w-20" : "w-64"}`}
            >
                {/* Expand/Collapse Sidebar */}
                <SidebarIcon isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div className="flex flex-col space-y-4">
                    <div className="h-[700px] flex flex-col justify-around">
                        <div className="flex items-center space-x-3 text-xl cursor-pointer" onClick={() => setActivePage("home")}>
                            <FaHome size={24} />
                            {!isCollapsed && <span>Home</span>}
                        </div>
                        <div className="flex items-center space-x-3 text-lg hover:text-green-400 transition cursor-pointer" onClick={() => setActivePage("events")}>
                            <FaCalendarCheck size={24} />
                            {!isCollapsed && <span>My Events</span>}
                        </div>
                        <div className="flex items-center space-x-3 text-lg hover:text-blue-400 transition cursor-pointer" onClick={() => setActivePage("tasks")}>
                            <FaTasks size={24} />
                            {!isCollapsed && <span>Tasks</span>}
                        </div>
                        <div className="flex items-center space-x-3 text-lg hover:text-green-400 transition cursor-pointer" onClick={() => setActivePage("community")}>
                            <FaUsers size={24} />
                            {!isCollapsed && <span>Community</span>}
                        </div>
                        
                        <div className="flex items-center space-x-3 text-lg hover:text-yellow-400 transition cursor-pointer" onClick={() => setActivePage("about us")}>
                            <FaInfoCircle size={24} />
                            {!isCollapsed && <span>About us</span>}
                        </div>
                        <div className="flex items-center space-x-3 text-lg hover:text-yellow-400 transition cursor-pointer" onClick={() => setActivePage("contact")}>
                            <FaEnvelope size={24} />
                            {!isCollapsed && <span>Contact</span>}
                        </div>
                        <div className="flex items-center space-x-3 text-lg hover:text-yellow-400 transition cursor-pointer" onClick={() => setActivePage("profile")}>
                            <FaUser size={24} />
                            {!isCollapsed && <span>My Profile</span>}
                        </div>
                    </div>
                </div>

                {/* ✅ Fixed Logout Button */}
                <button 
                    onClick={() => {
                        console.log("🔴 Logout Clicked"); // Debugging Log
                        logout();
                        navigate('/login');
                    }} 
                    className="flex items-center p-3 bg-red-500 hover:bg-red-700 rounded-md mt-4"
                >
                    <FaSignOutAlt /> <span className="ml-2">Logout</span>
                </button>
            </div>

            {/* ✅ Main Content (Changes Dynamically) */}
            <div className="w-full flex flex-col">
                {/* Dynamic Content - Switches based on activePage */}
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
                    {activePage === "tasks" && <h2 className="text-3xl font-bold">Manage Your Tasks</h2>}
                    {activePage === "community" && <h2 className="text-3xl font-bold">Community Engagement</h2>}
                    {activePage === "about us" && <h2 className="text-3xl font-bold">About Us</h2>}
                    {activePage === "contact" && <h2 className="text-3xl font-bold">Contact</h2>}
                </div>
            </div>
        </div>
    );
}

export default Home;
