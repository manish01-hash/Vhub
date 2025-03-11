import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EventPost from "./EventPost"; // Event Card Component
import { FaSearch, FaFilter } from "react-icons/fa";

function AllEvents() {
    const { user, logout } = useAuth(); 
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [allEvents, setAllEvents] = useState([]);  // Store all events
    const [noEventsMessage, setNoEventsMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [newRegistration, setNewRegistration] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
            console.log("🟡 Current Filter Value = ", filter);
    
            const filtered = allEvents.filter(event => filter==="All" || event.E_Status === filter);
    
            setEvents(filtered);
    
            console.log("✅ Events Fetched",events)
        }, [filter]); // Depend on allEvents to avoid data loss

        async function fetchEvents() {
            try {
                console.log("🟡 Fetching events...");
                const response = await axios.get("http://127.0.0.1:8000/api/events/", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                });
    
                if (response.data.length === 0) {
                    console.log("🔴 No events available");
                    setNoEventsMessage("No upcoming volunteer events. Stay tuned for new opportunities!");
                } else {
                    console.log("✅ Events Fetched:", response.data);
                    setEvents(response.data);    // Initialize displayed events
                    setAllEvents(response.data); // Store all events
                    setNoEventsMessage("");
                }
            } catch (error) {
                console.error("❌ Error fetching events:", error.response?.status, error.response?.data);
                setNoEventsMessage("No events are available at the moment.");
            } finally {
                setLoading(false);
            }
        }
    
    useEffect(() => {
        fetchEvents();
        setNewRegistration(false);
        },[newRegistration])

    return (
        <div className=" h-full w-full p-3">
            {/* <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name || "Guest"}!</h1>
            <p className="text-gray-600">Explore upcoming events and volunteer opportunities.</p> */}

             <nav className="bg-[#2d3748] p-4 rounded-lg shadow-md flex items-center h-[10%] justify-between">
                            {/* 🔍 Search Bar */}
                            <div className="flex items-center bg-[#1a202c] h-full  px-4 py-2 rounded-lg w-[40%]">
                                <FaSearch className="text-gray-400 mr-2" />
                                <input 
                                    type="text" 
                                    placeholder="Search events..." 
                                    className="bg-transparent text-white w-full focus:outline-none"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
            
                            {/* 🎯 Filter Dropdown */}
                            <div className="flex items-center bg-[#1a202c] px-4 py-2 rounded-lg">
                                <FaFilter className="text-gray-400 mr-2" />
                                <select 
                                    className="bg-transparent focus:outline-none"
                                    onChange={(e) =>( setFilter(e.target.value))}
                                >
                                    <option value="All" className="text-white bg-[#1a202c]">All Events</option>
                                    <option value="Upcoming" className="text-black">Upcoming</option>
                                    <option value="Ongoing" className="text-black">Ongoing</option>
                                    <option value="Completed" className="text-black">Completed</option>
                                </select>
                            </div>
                        </nav>

            {loading ? (
                <div className="text-center mt-10">
                    <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                    <p className="mt-3 text-gray-300">Loading events...</p>
                </div>
            ) : (
                <>
                    {errorMessage ? (
                        <div className="text-center mt-10 text-red-500">
                            <p className="text-xl">{errorMessage}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {events.map(event => (
                                <div key={event.E_ID} className="bg-[#2a3b4f] rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105">
                                    <EventPost 
                                        newRegistration={newRegistration}
                                        setNewRegistration={setNewRegistration}
                                        ename={event.E_Name} 
                                        event={event}  
                                        description={event.E_Description} 
                                        requiredVolunteers={event.E_Required_Volunteers} 
                                        totVolunteers={event.E_Volunteers?.length || 0} 
                                        fetchEvents={fetchEvents} // ✅ Ensure fetchEvents is passed
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AllEvents;   