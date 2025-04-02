import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";


function EventPost({ event, ename, description, requiredVolunteers, totVolunteers, fetchEvents, setNewRegistration }) {
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(false);
    
    const calculateStatus = (start, end) => {
        const now = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (now < startDate) return "Upcoming";
        if (now >= startDate && now <= endDate) return "Ongoing";
        return "Completed";
    };

    const [currentStatus, setCurrentStatus] = useState(
        calculateStatus(event.E_Start_Date, event.E_End_Date)
    );

    useEffect(() => {
        setCurrentStatus(calculateStatus(event.E_Start_Date, event.E_End_Date));
    }, [event.E_Start_Date, event.E_End_Date]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userRegistered = (event.E_Volunteers || []).some(
                    (volunteer) => volunteer.id === decoded.user_id
                );
                setIsRegistered(userRegistered);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, [event.E_Volunteers]);

    const handleJoin = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            Swal.fire("⚠️ Not Logged In", "You must be logged in to register!", "warning");
            return;
        }

        if ((totVolunteers || 0) >= (requiredVolunteers || 1)) {
            Swal.fire("Event Full", "This event has reached capacity.", "info");
            return;
        }

        try {
            const response = await axios.post(
                `https://vhub-zb2y.onrender.com/api/events/${event.E_ID}/register/`,
                {},
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
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
                setIsRegistered(true);
                navigate(`/home/`);
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
            const token = localStorage.getItem("accessToken");
            await axios.post(
                `https://vhub-zb2y.onrender.com/api/events/${event.E_ID}/leave/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsRegistered(false);
            fetchEvents && fetchEvents();
        } catch (error) {
            console.error("❌ Error leaving event:", error.response?.data || error.message);
            Swal.fire({
                title: "⚠️ Leave Event Error",
                text: error.response?.data?.error || "Failed to leave the event!",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="bg-[#1E293B] bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-600 transition-transform hover:scale-[1.02] hover:border-blue-400 duration-300">
            <div className="relative">
            <img
                src={event.E_Photo ? event.E_Photo : "https://via.placeholder.com/400x200"}
                alt={event.E_Name}
                className="w-full h-52 object-cover rounded-xl shadow-md border border-gray-700 transition-all duration-300 hover:brightness-110"
            />

                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow-md">
                    {totVolunteers}/{requiredVolunteers} Volunteers
                </span>
            </div>
            <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-green-400">{ename}</h2>
                <p className="text-gray-300 mt-2 line-clamp-3">{description}</p>
            </div>

            <div className="mt-5 flex flex-col gap-3">
                {isRegistered ? (
                    <button
                        onClick={handleLeave}
                        className="w-full bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all shadow-md transform hover:scale-105"
                    >
                        Leave Event
                    </button>
                ) : (
                    <button
                        onClick={handleJoin}
                        disabled={currentStatus !== "Upcoming" || totVolunteers === requiredVolunteers}
                        className={`w-full ${
                            currentStatus === "Upcoming" && totVolunteers < requiredVolunteers
                                ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                                : "bg-gray-500 cursor-not-allowed"
                        } text-white px-5 py-2 rounded-xl transition-all shadow-md transform hover:scale-105`}
                    >
                        {currentStatus === "Upcoming" && totVolunteers < requiredVolunteers
                            ? "Join Event"
                            : currentStatus === "Ongoing"
                            ? "Ongoing"
                            : currentStatus === "Completed"
                            ? "Event Completed"
                            : "Event Full"}
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
