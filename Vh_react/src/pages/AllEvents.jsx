import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import EventPost from "./EventPost"; // Event Card Component

function AllEvents() {
    const { user, logout } = useAuth(); 
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            console.log("🟡 Fetching events...");

            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("🚨 No access token found. Redirecting to login.");
                setErrorMessage("Unauthorized! Please log in again.");
                return;
            }

            const response = await axios.get("http://127.0.0.1:8000/api/events/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ API Response:", response.data);

            if (Array.isArray(response.data) && response.data.length > 0) {
                setEvents(response.data);
                setErrorMessage(""); 
            } else {
                console.warn("🚨 No events available:", response.data);
                setErrorMessage(response.data?.message || "No events available.");
                setEvents([]);
            }
        } catch (error) {
            console.error("❌ Error fetching events:", error.response?.status, error.response?.data);

            if (error.response?.status === 401) {
                setErrorMessage("Session expired. Please log in again.");
                logout();
            } else {
                setErrorMessage("Failed to load events. Try again later.");
            }

            setEvents([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name || "Guest"}!</h1>
            <p className="text-gray-600">Explore upcoming events and volunteer opportunities.</p>

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
                                <div key={event.E_ID} className="bg-gray-300 rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105">
                                    <EventPost 
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