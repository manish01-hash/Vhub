import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EventPost from "./EventPost"; // Event Card Component
import { FaSearch, FaFilter } from "react-icons/fa";

function AllEvents() {
    const { user, logout } = useAuth();
    const [events, setEvents] = useState([]);
    const [backupEvents, setBackupEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [newRegistration, setNewRegistration] = useState(false);

    // ✅ Fetch events once on mount
    useEffect(() => {
        fetchEvents();
    }, []);

    // ✅ Refetch events only if new registration happens
    useEffect(() => {
        if (newRegistration) {
            fetchEvents();
            setNewRegistration(false);
        }
    }, [newRegistration]);

    // ✅ Fetch Events from API
    async function fetchEvents() {
        setLoading(true);
        setErrorMessage("");

        try {
            console.log("🟡 Fetching events...");
            const response = await axios.get("https://vhub-zb2y.onrender.com/api/events/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });

            const eventsData = response.data || [];
            console.log("✅ Events Fetched:", eventsData);

            if (eventsData.length === 0) {
                setErrorMessage("No upcoming volunteer events. Stay tuned for new opportunities!");
                setEvents([]);
                setBackupEvents([]);
            } else {
                setEvents(eventsData);
                setBackupEvents(eventsData);
            }
        } catch (error) {
            console.error("❌ Error fetching events:", error);
            setErrorMessage("Failed to load events. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    // ✅ Filter Events based on search & dropdown selection
    useEffect(() => {
        let filteredEvents = backupEvents;

        // 🔎 Apply Search Filter
        if (searchTerm.trim()) {
            filteredEvents = filteredEvents.filter((event) =>
                event.E_Name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 🎯 Apply Status Filter
        if (filter !== "All") {
            filteredEvents = filteredEvents.filter((event) => event.E_Status === filter);
        }

        setEvents(filteredEvents);
    }, [searchTerm, filter, backupEvents]);

    return (
        <div className="h-full w-full p-6 bg-[#1a202c]">
            {/* 🎯 Navigation Bar */}
            <nav className="bg-[#2d3748] p-4 rounded-lg shadow-md flex items-center justify-between mb-6">
                {/* 🔍 Search Bar */}
                <div className="flex items-center bg-[#1a202c] h-full px-4 py-2 rounded-lg w-[40%]">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="bg-transparent text-white w-full focus:outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                </div>

                {/* 🎯 Filter Dropdown */}
                <div className="flex items-center bg-[#1a202c] px-4 py-2 rounded-lg">
                    <FaFilter className="text-gray-400 mr-2" />
                    <select
                        className="bg-transparent text-white focus:outline-none"
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                    >
                        <option value="All">All Events</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </nav>

            {/* 🎯 Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="ml-4 text-gray-300">Loading events...</p>
                </div>
            ) : (
                <>
                    {/* 🎯 Error Message */}
                    {errorMessage && (
                        <div className="text-center mt-10 text-red-500">
                            <p className="text-xl">{errorMessage}</p>
                        </div>
                    )}

                    {/* 🎯 Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div
                                key={event.E_ID}
                                className="bg-[#2a3b4f] rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105"
                            >
                                <EventPost
                                    newRegistration={newRegistration}
                                    setNewRegistration={setNewRegistration}
                                    ename={event.E_Name}
                                    event={event}
                                    description={event.E_Description}
                                    requiredVolunteers={event.E_Required_Volunteers}
                                    totVolunteers={event.E_Volunteers?.length || 0}
                                    fetchEvents={fetchEvents}
                                    user={user}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AllEvents;
