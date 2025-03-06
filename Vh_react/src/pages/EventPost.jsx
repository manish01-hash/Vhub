import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function EventPost({ event, ename, description, requiredVolunteers, totVolunteers, fetchEvents }) {
    const navigate = useNavigate(); // Initialize navigate
    const [isJoined, setIsJoined] = useState(false);

    const handleJoin = async () => {
        const token = localStorage.getItem("accessToken");
    
        if (!token) {
            alert("⚠️ You must be logged in to register for an event!");
            return;
        }
    
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/events/${event.E_ID}/register/`,
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response.status === 201) {
                alert("✅ Successfully registered!");
                console.log("✅ Registration successful:", response.data);
                navigate(`/events/${event.E_ID}/register`); // ✅ Ensure this navigates correctly
            } else {
                alert("⚠️ Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error registering for event:", error.response?.data || error.message);
            alert(`⚠️ ${error.response?.data?.error || "Failed to register!"}`);
        }
    };
    

    const handleLeave = async () => {
        try {
            setIsJoined(false);
            await axios.post(
                `http://127.0.0.1:8000/api/events/${event.E_ID}/leave/`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                }
            );
            if (typeof fetchEvents === "function") {
                fetchEvents();
            } else {
                console.warn("⚠️ fetchEvents is not defined, skipping refresh.");
            }
        } catch (error) {
            console.error("❌ Error leaving event:", error.response?.data || error.message);
            setIsJoined(true);
        }
    };

    return (
        <div className="bg-gray-300 p-4 rounded-lg shadow-md">
            <img 
                src={event.E_Photo ? `http://127.0.0.1:8000${event.E_Photo}` : "default-image-url.jpg"} 
                alt={event.E_Name} 
                className="w-full h-40 object-cover rounded-md"
            />

            <h2 className="text-2xl font-semibold mt-3">{ename}</h2>
            <p className="text-gray-600">{description.substring(0, 100)}...</p>
            <p className="mt-2 text-blue-600 font-semibold">Volunteers: {totVolunteers}/{requiredVolunteers}</p>
            
            {isJoined ? (
                <button 
                    onClick={handleLeave}
                    className="mt-4 bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-lg">
                    Exit Event
                </button>
            ) : (
                <button 
                    onClick={handleJoin}
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
                    Apply
                </button>
            )}
            
            <Link 
                to={`/events/${event.E_ID}`} 
                className="text-md font-bold mt-2 block text-center bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                View Event
            </Link>
        </div>
    );
}

export default EventPost;