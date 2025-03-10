import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarCheck, FaPlusCircle, FaBullhorn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminDashboard() {
    const navigate = useNavigate();
    const [totalEvents, setTotalEvents] = useState(0);
    const [activeVolunteers, setActiveVolunteers] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const eventsResponse = await axios.get("http://127.0.0.1:8000/api/events/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalEvents(eventsResponse.data.length);

                const volunteersResponse = await axios.get("http://127.0.0.1:8000/api/volunteers/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setActiveVolunteers(volunteersResponse.data.length);
            } catch (error) {
                setError("❌ Error fetching dashboard data");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            {/* ✅ Sidebar Navigation */}
            <Sidebar />

            {/* ✅ Main Dashboard Content */}
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide text-gray-200">
                    Admin Dashboard
                </h1>

                {error && <p className="text-red-500 text-center">{error}</p>}

                {/* ✅ Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#2d3748] bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-lg flex items-center transition transform hover:scale-105 hover:bg-opacity-100 duration-300">
                        <FaCalendarCheck size={40} className="text-green-400 mr-4" />
                        <div>
                            <h2 className="text-3xl font-bold">{totalEvents}</h2>
                            <p className="text-gray-300 text-lg">Total Events</p>
                        </div>
                    </div>
                
                    <div className="bg-[#2d3748] bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-lg flex items-center transition transform hover:scale-105 hover:bg-opacity-100 duration-300">
                        <FaUsers size={40} className="text-blue-400 mr-4" />
                        <div>
                            <h2 className="text-3xl font-bold">{activeVolunteers}</h2>
                            <p className="text-gray-300 text-lg">Active Volunteers</p>
                        </div>
                    </div>
                </div>

                {/* ✅ Quick Actions */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <button 
                        onClick={() => navigate("/admin/events/create")} 
                        className="flex items-center justify-center bg-green-500 hover:bg-green-700 p-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-105 shadow-md"
                    >
                        <FaPlusCircle className="mr-3 text-xl" /> Create Event
                    </button>
                    <button 
                        onClick={() => navigate("/admin/volunteers")} 
                        className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 p-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-105 shadow-md"
                    >
                        <FaUsers className="mr-3 text-xl" /> Manage Volunteers
                    </button>
                    <button 
                        onClick={() => navigate("/admin/events")} 
                        className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-700 p-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-105 shadow-md"
                    >
                        <FaBullhorn className="mr-3 text-xl" /> Manage Events
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
