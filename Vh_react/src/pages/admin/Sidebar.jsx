import React, { useState } from "react";
import { FaHome, FaCalendarCheck, FaTasks, FaUsers, FaClipboardList, FaBullhorn, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false); // ✅ Sidebar toggle

    return (
        <div className={`min-h-screen bg-[#2d3748] flex flex-col justify-between p-6 shadow-lg transition-all ${isCollapsed ? "w-20" : "w-64"}`}>
            {/* ✅ Toggle Sidebar Button */}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white mb-4">
                {isCollapsed ? "➡️" : "⬅️"}
            </button>

            {/* ✅ Sidebar Links */}
            <div className="flex flex-col space-y-6">
                <div className="flex items-center space-x-3 text-lg hover:text-green-400 cursor-pointer" onClick={() => navigate("/admin-dashboard")}> 
                    <FaHome size={24} /> {!isCollapsed && <span>Dashboard</span>}
                </div>
                <div className="flex items-center space-x-3 text-lg hover:text-blue-400 cursor-pointer" onClick={() => navigate("/admin/events")}> 
                    <FaCalendarCheck size={24} /> {!isCollapsed && <span>Events</span>}
                </div>
                <div className="flex items-center space-x-3 text-lg hover:text-yellow-400 cursor-pointer" onClick={() => navigate("/admin/tasks")}> 
                    <FaTasks size={24} /> {!isCollapsed && <span>Tasks</span>}
                </div>
                <div className="flex items-center space-x-3 text-lg hover:text-purple-400 cursor-pointer" onClick={() => navigate("/admin/volunteers")}> 
                    <FaUsers size={24} /> {!isCollapsed && <span>Volunteers</span>}
                </div>
                <div className="flex items-center space-x-3 text-lg hover:text-orange-400 cursor-pointer" onClick={() => navigate("/admin/attendance")}> 
                    <FaClipboardList size={24} /> {!isCollapsed && <span>Attendance</span>}
                </div>
                <div className="flex items-center space-x-3 text-lg hover:text-red-400 cursor-pointer" onClick={() => navigate("/admin/announcements")}> 
                    <FaBullhorn size={24} /> {!isCollapsed && <span>Announcements</span>}
                </div>
            </div>

            {/* ✅ Logout Button */}
            <button 
                onClick={() => {
                    logout();
                    navigate("/login");
                }} 
                className="flex items-center p-3 bg-red-500 hover:bg-red-700 rounded-md mt-4"
            >
                <FaSignOutAlt /> <span className="ml-2">Logout</span>
            </button>
        </div>
    );
}

export default Sidebar;
