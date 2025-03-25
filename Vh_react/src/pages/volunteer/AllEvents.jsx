import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EventPost from "./EventPost";
import { FaSearch, FaFilter } from "react-icons/fa";

function AllEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [backupEvents, setBackupEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [noEventsMessage, setNoEventsMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [newRegistration, setNewRegistration] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [newRegistration]);

    useEffect(() => {
        const filtered = backupEvents.filter((event) => 
            filter === "All" || event.E_Status === filter
        );
        setEvents(filtered);
    }, [filter, backupEvents]);

    useEffect(() => {
        const searchedEvents = backupEvents.filter((event) =>
            event.E_Name.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        setEvents(searchedEvents);
    }, [searchTerm, backupEvents]);

    async function fetchEvents() {
        try {
            setLoading(true);
            setErrorMessage("");
            const response = await axios.get("https://vhub-zb2y.onrender.com/api/events/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
    
            // Add null checks for response data
            const eventsData = response.data || [];
            
            if (eventsData.length === 0) {
                setNoEventsMessage("No upcoming volunteer events. Stay tuned for new opportunities!");
                setEvents([]);
                setBackupEvents([]);
            } else {
                // Ensure all events have required fields
                const validatedEvents = eventsData.map(event => ({
                    ...event,
                    E_Name: event.E_Name || "Untitled Event",
                    E_Description: event.E_Description || "",
                    E_Required_Volunteers: event.E_Required_Volunteers || 0,
                    E_Volunteers: event.E_Volunteers || []
                }));
                
                setEvents(validatedEvents);
                setBackupEvents(validatedEvents);
                setNoEventsMessage("");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setErrorMessage(error.response?.data?.error || "Failed to load events. Please try again later.");
            setNoEventsMessage("");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="h-full w-full p-6 bg-[#1a202c]">
            <nav className="bg-[#2d3748] p-4 rounded-lg shadow-md flex items-center justify-between mb-6">
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

            {loading ? (
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="ml-4 text-gray-300">Loading events...</p>
                </div>
            ) : (
                <>
                    {errorMessage && (
                        <div className="text-center mt-10 text-red-500">
                            <p className="text-xl">{errorMessage}</p>
                        </div>
                    )}

                    {noEventsMessage && (
                        <div className="text-center mt-10 text-gray-400">
                            <p className="text-xl">{noEventsMessage}</p>
                        </div>
                    )}

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