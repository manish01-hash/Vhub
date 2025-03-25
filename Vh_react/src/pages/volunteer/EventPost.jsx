import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EventPost({ event, ename, description, requiredVolunteers, totVolunteers, fetchEvents, newRegistration, setNewRegistration }) {
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(false);

    const determineEventStatus = (startDate, endDate) => {
        if (!startDate || !endDate) return "Unknown";
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (now < start) return "Upcoming";
        if (now >= start && now <= end) return "Ongoing";
        return "Completed";
    };

    const eventStatus = determineEventStatus(event.E_Start_Date, event.E_End_Date);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token && event.E_Volunteers) {
            try {
                const decoded = JSON.parse(atob(token.split(".")[1])); 
                const userId = decoded?.user_id || decoded?.id;
                const userRegistered = event.E_Volunteers.some(volunteer => volunteer.id === userId);
                setIsRegistered(userRegistered);
            } catch (error) {
                console.error("❌ JWT Decode Error:", error);
            }
        }
    }, [event.E_Volunteers]);

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
                `https://vhub-zb2y.onrender.com/api/events/${event.E_ID}/register/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
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
                fetchEvents();
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

    const eventPhoto = event.E_Photo?.startsWith("http")
        ? event.E_Photo
        : `https://vhub-zb2y.onrender.com${event.E_Photo}`;

    return (
        <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg border border-gray-600">
            <div className="relative">
                <img src={eventPhoto} alt={event.E_Name} className="w-full h-52 object-cover rounded-xl" />
                <span className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-lg">
                    {totVolunteers}/{requiredVolunteers} Volunteers
                </span>
            </div>
            <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-green-400">{ename}</h2>
                <p className="text-gray-300 mt-2">{description.substring(0, 100)}...</p>
            </div>
        </div>
    );
}

export default EventPost;
