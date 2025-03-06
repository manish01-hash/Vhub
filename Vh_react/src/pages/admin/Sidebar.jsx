import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUsers, FaChartLine, FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
    const location = useLocation(); // ✅ Get current route
    const navigate = useNavigate(); // ✅ For redirection

    const handleLogout = () => {
        localStorage.clear(); // ✅ Clear stored user data
        navigate("/login"); // ✅ Redirect to login page
    };

    return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <Link to="/admin-dashboard" 
                            className={`flex items-center p-3 rounded-md ${location.pathname === "/admin-dashboard" ? "bg-blue-500" : "hover:bg-gray-700"}`}>
                            <FaHome className="mr-3" /> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/events" 
                            className={`flex items-center p-3 rounded-md ${location.pathname === "/admin/events" ? "bg-blue-500" : "hover:bg-gray-700"}`}>
                            <FaCalendarAlt className="mr-3" /> Manage Events
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/volunteers" 
                            className={`flex items-center p-3 rounded-md ${location.pathname === "/admin/volunteers" ? "bg-blue-500" : "hover:bg-gray-700"}`}>
                            <FaUsers className="mr-3" /> Manage Volunteers
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/attendance" 
                            className={`flex items-center p-3 rounded-md ${location.pathname === "/admin/attendance" ? "bg-blue-500" : "hover:bg-gray-700"}`}>
                            <FaChartLine className="mr-3" /> Attendance Reports
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="flex items-center p-3 w-full text-left rounded-md hover:bg-red-600 mt-6">
                            <FaSignOutAlt className="mr-3" /> Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
