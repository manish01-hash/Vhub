import React, { useEffect, useState } from "react";
import { FaClipboardList, FaUsers, FaCalendarCheck, FaChartBar } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalVolunteers, setTotalVolunteers] = useState(0);
    const [attendanceRate, setAttendanceRate] = useState(0);
    const navigate = useNavigate();

    // ✅ Fetch data from the backend
    useEffect(() => {
        const fetchDashboardData = async () => {  // ✅ Function Expression
            try {
                const token = localStorage.getItem("accessToken");
                const headers = { Authorization: `Bearer ${token}` };
    
                const eventsResponse = await axios.get("http://127.0.0.1:8000/api/events/", { headers });
                setTotalEvents(eventsResponse.data.length);
                const volunteersResponse = await axios.get("http://127.0.0.1:8000/api/volunteers/", { headers });
                setTotalVolunteers(volunteersResponse.data.length);  // ✅ Now only Volunteers are counted
                const attendanceResponse = await axios.get("http://127.0.0.1:8000/api/attendance/rate/", { headers });
                setAttendanceRate(attendanceResponse.data.attendance_rate || 0);
                

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchDashboardData();
    }, []);
    
    

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                
                {/* ✅ Dashboard Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg" onClick={() => navigate("/admin/events")}> 
                        <FaCalendarCheck className="text-blue-500 text-4xl mr-4" />
                        <div>
                            <h2 className="text-xl font-bold">Total Events</h2>
                            <p className="text-gray-600">{totalEvents}</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg" onClick={() => navigate("/admin/volunteers")}> 
                        <FaUsers className="text-green-500 text-4xl mr-4" />
                        <div>
                            <h2 className="text-xl font-bold">Total Volunteers</h2>
                            <p className="text-gray-600">{totalVolunteers}</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg" onClick={() => navigate("/admin/attendance")}> 
                        <FaChartBar className="text-purple-500 text-4xl mr-4" />
                        <div>
                            <h2 className="text-xl font-bold">Attendance Rate</h2>
                            <p className="text-gray-600">{attendanceRate}%</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
