import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import EventPost from "./EventPost"; // Event Card Component

function AllEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noEventsMessage, setNoEventsMessage] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

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
                setEvents(response.data);
                setNoEventsMessage(""); 
            }
        } catch (error) {
            console.error("❌ Error fetching events:", error.response?.status, error.response?.data);
            setNoEventsMessage("No events are available at the moment.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name}!</h1>
            <p className="text-gray-600">Explore upcoming events and volunteer opportunities.</p>

            {loading ? (
                <div className="text-center mt-10">
                    <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                    <p className="mt-3 text-gray-300">Loading events...</p>
                </div>
            ) : (
                <>
                    {noEventsMessage ? (
                        <div className="text-center mt-10 text-gray-500">
                            <p className="text-xl">{noEventsMessage}</p>
                            <img src="/no-events.svg" alt="No Events" className="mx-auto mt-5 w-60 opacity-75" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {events.map(event => (
                                <div key={event.E_ID} className="bg-gray-300 rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105">
                                    <EventPost 
                                        ename={event.E_Name} 
                                        event={event}  
                                        description={event.E_Description} 
                                        requiredVolunteers={event.E_Required_Volunteers} 
                                        totVolunteers={event.E_Volunteers.length} 
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
