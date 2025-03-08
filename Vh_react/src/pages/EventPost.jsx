import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function EventPost({ event, ename, description, requiredVolunteers, totVolunteers, fetchEvents }) {
    const navigate = useNavigate();
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
                { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            if (response.status === 201) {
                alert("✅ Successfully registered!");
                navigate(`/events/${event.E_ID}/register`);
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
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            fetchEvents && fetchEvents();
        } catch (error) {
            console.error("❌ Error leaving event:", error.response?.data || error.message);
            setIsJoined(true);
        }
    };

    return (
        <div className="bg-[#2a3b4f] p-6 rounded-lg shadow-lg text-white">
            <img 
                src={event.E_Photo ? `http://127.0.0.1:8000${event.E_Photo}` : "default-image-url.jpg"} 
                alt={event.E_Name} 
                className="w-full h-52 object-cover rounded-md shadow-md border border-gray-700"
            />
            <div className="mt-4">
                <h2 className="text-2xl font-bold text-green-400">{ename}</h2>
                <p className="text-gray-300 mt-2">{description.substring(0, 100)}...</p>
                <p className="mt-2 text-yellow-400 font-semibold">Volunteers: {totVolunteers}/{requiredVolunteers}</p>
            </div>
            <div className="mt-4 flex gap-3">
                {isJoined ? (
                    <button 
                        onClick={handleLeave}
                        className="w-full bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all"
                    >
                        Exit Event
                    </button>
                ) : (
                    <button 
                        onClick={handleJoin}
                        className="w-full bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-all"
                    >
                        Apply
                    </button>
                )}
            </div>
            <Link 
                to={`/events/${event.E_ID}`} 
                className="mt-3 block text-center bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-all"
            >
                View Event
            </Link>
        </div>
    );
}

export default EventPost;