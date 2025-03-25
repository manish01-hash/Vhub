import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminEditEvent() {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const determineEventStatus = (startDate, startTime, endDate, endTime) => {
        const now = new Date();
        const start = new Date(`${startDate}T${startTime}:00`);
        const end = new Date(`${endDate}T${endTime}:00`);

        if (now < start) return "Upcoming";
        if (now >= start && now <= end) return "Ongoing";
        return "Completed";
    };

    const fetchEventDetails = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setErrorMessage("❌ Unauthorized! No token found.");
                return;
            }

            const response = await axios.get(
                `https://vhub-zb2y.onrender.com/api/events/${eventId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                const event = response.data;

                // ✅ Format date and time correctly
                event.E_Start_Date = event.E_Start_Date.split("T")[0];
                event.E_End_Date = event.E_End_Date.split("T")[0];
                event.E_Start_Time = event.E_Start_Time ? event.E_Start_Time.slice(0, 5) : "";
                event.E_End_Time = event.E_End_Time ? event.E_End_Time.slice(0, 5) : "";

                setEventData(event);
            } else {
                setErrorMessage("❌ Event data not found.");
            }
        } catch (error) {
            setErrorMessage("❌ Error fetching event details.");
        }
    };

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, E_Photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
    
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setErrorMessage("❌ Unauthorized! No token found.");
            return;
        }
    
        if (!eventData) {
            setErrorMessage("❌ No event data available.");
            return;
        }
    
        // ✅ Calculate event status dynamically
        const updatedStatus = determineEventStatus(
            eventData.E_Start_Date,
            eventData.E_Start_Time,
            eventData.E_End_Date,
            eventData.E_End_Time
        );
    
        const updatedEventData = { ...eventData, E_Status: updatedStatus };
    
        // ✅ Fix: Ensure empty arrays are sent as `null` instead of `[]`
        if (Array.isArray(updatedEventData.E_Coordinators) && updatedEventData.E_Coordinators.length === 0) {
            updatedEventData.E_Coordinators = null;
        }
        if (Array.isArray(updatedEventData.E_Super_Volunteers) && updatedEventData.E_Super_Volunteers.length === 0) {
            updatedEventData.E_Super_Volunteers = null;
        }
    
        const formData = new FormData();
        Object.keys(updatedEventData).forEach((key) => {
            let value = updatedEventData[key];
    
            if (value) {
                if (key === "E_Photo" && value instanceof File) {
                    formData.append("E_Photo", value);
                } else if (Array.isArray(value)) {
                    // ✅ Convert array to JSON string only if it's not null
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });
    
        try {
            const response = await axios.put(
                `https://vhub-zb2y.onrender.com/api/events/${eventId}/update/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            console.log("✅ Event Updated:", response.data);
            navigate("/admin/events");
        } catch (error) {
            console.error("❌ Error updating event:", error.response?.data || error);
            setErrorMessage(`❌ Failed to update event: ${JSON.stringify(error.response?.data)}`);
        }
    };
    
    if (!eventData) return <p className="text-white text-center">Loading event details...</p>;

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6">Edit Event</h1>
                <form onSubmit={handleSubmit} className="bg-[#2d3748] p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <label className="block mb-2">Event Name:</label>
                    <input type="text" name="E_Name" value={eventData.E_Name} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Description:</label>
                    <textarea name="E_Description" value={eventData.E_Description} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded"></textarea>

                    <label className="block mb-2">Event Photo:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Required Volunteers:</label>
                    <input type="number" name="E_Required_Volunteers" value={eventData.E_Required_Volunteers} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Start Date:</label>
                    <input type="date" name="E_Start_Date" value={eventData.E_Start_Date} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Start Time:</label>
                    <input type="time" name="E_Start_Time" value={eventData.E_Start_Time} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">End Date:</label>
                    <input type="date" name="E_End_Date" value={eventData.E_End_Date} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">End Time:</label>
                    <input type="time" name="E_End_Time" value={eventData.E_End_Time} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700 p-3 rounded-lg font-bold">Update Event</button>
                </form>
            </div>
        </div>
    );
}

export default AdminEditEvent;
