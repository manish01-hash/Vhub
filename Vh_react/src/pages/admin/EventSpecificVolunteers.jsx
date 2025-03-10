import React, { useEffect, useState } from "react";
import { FaUserShield, FaPlusCircle, FaSearch } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import AddTaskModal from "./AddTaskModal";
import ViewTasks from "./ViewTasks";
import AssignRole from "./AssignRole";

function EventSpecificVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [backupVolunteers, setBackupVolunteers] = useState([]);
    const { eventId, updateEventId } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [backupTasks, setBackupTasks] = useState([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [viewTasksBtn, setViewTasksBtn] = useState(false);

    useEffect(() => {
        let storedEventId = localStorage.getItem("eventId");
        if (!eventId && storedEventId) {
            updateEventId(storedEventId);
        }
    }, [eventId, updateEventId]);

    // ✅ Fetch volunteers
    const fetchVolunteers = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get("http://127.0.0.1:8000/api/registrations/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ Get event-specific volunteers
            const filteredVolunteers = response.data.filter((registration) => (
                registration.event.E_ID === eventId
            ));

            setVolunteers(filteredVolunteers);
            setBackupVolunteers(filteredVolunteers);
        } catch (error) {
            console.error("❌ Error fetching volunteers:", error);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchVolunteers();
        }
    }, [eventId]);

    // ✅ Search function
    useEffect(() => {
        const searchedVolunteers = searchQuery
            ? backupVolunteers.filter((registration) =>
                registration.volunteer.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : backupVolunteers;

        setVolunteers(searchedVolunteers);
    }, [searchQuery, backupVolunteers]);

    // ✅ Fetch tasks for the event
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/tasks/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
            setBackupTasks(response.data);
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            {/* ✅ Sidebar Navigation */}
            <Sidebar />

            {/* ✅ Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide text-gray-200">
                    Event Details
                </h1>

                {/* ✅ Search & Task Buttons */}
                <div className="flex items-center justify-between h-[10%] p-3 rounded-lg w-full mb-6">
                    {/* 🔍 Search Bar */}
                    <div className="flex items-center bg-gray-800 p-3 h-full rounded-lg w-[40%] shadow-md transition focus-within:ring-2 focus-within:ring-green-400">
                        <FaSearch className="text-gray-300 mr-2" />
                        <input
                            type="text"
                            placeholder={viewTasksBtn ? "Search tasks..." : "Search volunteers..."}
                            className="bg-transparent focus:outline-none text-white w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* 🛠 Task Buttons */}
                    <div className="flex space-x-4 h-full w-[50%]">
                        {/* ✅ Open Modal Instead of Navigating */}
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="flex items-center bg-green-500 hover:bg-green-700 p-3 px-5 rounded-lg text-lg font-bold transition duration-300 h-full w-[40%] transform hover:scale-105 shadow-md"
                        >
                            <FaPlusCircle className="mr-3" /> Add Task
                        </button>

                        {/* 🔵 Toggle Between View Tasks & Volunteers */}
                        <button
                            onClick={() => setViewTasksBtn(!viewTasksBtn)}
                            className={`flex items-center p-3 px-5 rounded-lg text-lg font-bold transition duration-300 w-[40%] h-full transform hover:scale-105 shadow-md 
                            ${viewTasksBtn ? "bg-gray-600 hover:bg-gray-800" : "bg-blue-500 hover:bg-blue-700"}`}
                        >
                            {viewTasksBtn ? "View Volunteers" : "View Tasks"}
                        </button>
                    </div>
                </div>

                {/* ✅ Volunteers Table */}
                {!viewTasksBtn && (
                    <div className="bg-[#2d3748] bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-600 text-lg text-gray-300">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(volunteers) && volunteers.length > 0 ? (
                                    volunteers.map((registration) => (
                                        <tr key={registration.R_ID} className="border-b border-gray-700 text-gray-200 hover:bg-gray-700 transition">
                                            <td className="p-3">{registration.volunteer.name}</td>
                                            <td className="p-3">{registration.volunteer.email}</td>
                                            <td className="p-3">{registration.volunteer.phone || "N/A"}</td>

                                            {/* ✅ FIXED: Use `registration.role`, NOT `registration.volunteer.role` */}
                                            <td className="p-3">{registration.role}</td>
                                            <td className="p-3">
                                                <AssignRole
                                                    userId={registration.volunteer.id}
                                                    eventId={eventId}
                                                    currentRole={registration.role || "Loading..."}  // ✅ Ensure initial role is set
                                                    setVolunteers={setVolunteers}
                                                />
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-gray-400">No volunteers available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ✅ View Tasks Section */}
                {viewTasksBtn && <ViewTasks tasks1={tasks} searchQuery={searchQuery} />}

                {/* ✅ Add Task Modal */}
                <AddTaskModal
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    fetchTasks={fetchTasks}
                />
            </div>
        </div>
    );
}

export default EventSpecificVolunteers;
