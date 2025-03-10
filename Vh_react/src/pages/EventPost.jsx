import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EventPost({ event, ename, description, requiredVolunteers, totVolunteers, fetchEvents, newRegistration, setNewRegistration }) {
    const navigate = useNavigate();
    const [isJoined, setIsJoined] = useState(false);

    const handleJoin = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            Swal.fire({
                title: "⚠️ Not Logged In",
                text: "You must be logged in to register for an event!",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/events/${event.E_ID}/register/`,
                {},
                { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            if (response.status === 201) {
                Swal.fire({
                    title: "🎉 Success!",
                    text: "You have successfully registered for the event.",
                    icon: "success",
                    timer: 3000,
                    timerProgressBar: true,
                    confirmButtonText: "OK",
                });
                setNewRegistration(true);
                navigate(`/home/`);
            } else {
                Swal.fire({
                    title: "⚠️ Registration Failed",
                    text: "Please try again.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("❌ Error registering for event:", error.response?.data || error.message);
            Swal.fire({
                title: "⚠️ Registration Error",
                text: error.response?.data?.error || "Failed to register!",
                icon: "error",
                confirmButtonText: "OK",
            });
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
        <div className="bg-[#1E293B] bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-600 transition-transform hover:scale-[1.02] hover:border-blue-400 duration-300">
            {/* Event Image */}
            <div className="relative">
                <img 
                    src={event.E_Photo ? `http://127.0.0.1:8000${event.E_Photo}` : "default-image-url.jpg"} 
                    alt={event.E_Name} 
                    className="w-full h-52 object-cover rounded-xl shadow-md border border-gray-700 transition-all duration-300 hover:brightness-110"
                />
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow-md">
                    {totVolunteers}/{requiredVolunteers} Volunteers
                </span>
            </div>

            {/* Event Info */}
            <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-green-400">{ename}</h2>
                <p className="text-gray-300 mt-2">{description.substring(0, 100)}...</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col gap-3">
                {isJoined ? (
                    <button 
                        onClick={handleLeave}
                        className="w-full bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all shadow-md transform hover:scale-105"
                    >
                        Exit Event
                    </button>
                ) : (
                    <button 
                        onClick={handleJoin}
                        className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-5 py-2 rounded-xl transition-all shadow-md transform hover:scale-105"
                    >
                        Apply
                    </button>
                )}
                <Link 
                    to={`/events/${event.E_ID}`} 
                    className="block text-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md transform hover:scale-105"
                >
                    View Event
                </Link>
            </div>
        </div>
    );
}

export default EventPost;
