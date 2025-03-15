import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminCreateEvent() {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        E_Name: "",
        E_Description: "",
        E_Start_Date: "",
        E_Start_Time: "",
        E_End_Date: "",
        E_End_Time: "",
        E_Location: "",
        E_Photo: null,
        E_Required_Volunteers: 10,
        E_Status: "Upcoming",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, E_Photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Validation Checks
        const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

        // 1. Start Date must be >= current date
        if (eventData.E_Start_Date < currentDate) {
            setErrorMessage("❌ Start Date cannot be in the past.");
            return;
        }

        // 2. End Date must be >= Start Date
        if (eventData.E_End_Date < eventData.E_Start_Date) {
            setErrorMessage("❌ End Date cannot be before Start Date.");
            return;
        }

        // 3. If Start Date and End Date are the same, End Time must be > Start Time
        if (eventData.E_Start_Date === eventData.E_End_Date && eventData.E_End_Time <= eventData.E_Start_Time) {
            setErrorMessage("❌ End Time must be after Start Time for the same day.");
            return;
        }

        // 4. Required Volunteers must be a positive integer
        if (eventData.E_Required_Volunteers <= 0) {
            setErrorMessage("❌ Required Volunteers must be a positive number.");
            return;
        }

        // 5. Event Name and Description must not be empty
        if (!eventData.E_Name.trim() || !eventData.E_Description.trim()) {
            setErrorMessage("❌ Event Name and Description are required.");
            return;
        }

        // 6. Event Photo must be uploaded and of valid type
        if (!eventData.E_Photo || !eventData.E_Photo.type.startsWith("image/")) {
            setErrorMessage("❌ Please upload a valid image file.");
            return;
        }

        // If all validations pass, proceed with form submission
        const formData = new FormData();
        Object.keys(eventData).forEach((key) => {
            formData.append(key, eventData[key]);
        });

        try {
            const token = localStorage.getItem("accessToken");
            await axios.post("http://127.0.0.1:8000/api/events/create/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/admin/events");
        } catch (error) {
            setErrorMessage("❌ Error creating event. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6">Create New Event</h1>
                <form onSubmit={handleSubmit} className="bg-[#2d3748] p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <label className="block mb-2">Event Name:</label>
                    <input type="text" name="E_Name" value={eventData.E_Name} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Description:</label>
                    <textarea name="E_Description" value={eventData.E_Description} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded"></textarea>

                    <label className="block mb-2">Event Photo:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Event Location:</label>
                    <input type="text" name="E_Location" value={eventData.E_Location} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

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

                    <label className="block mb-2">Status:</label>
                    <select name="E_Status" value={eventData.E_Status} onChange={handleChange} className="w-full p-2 mb-4 bg-gray-700 rounded">
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>

                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                    <button type="submit" className="w-full bg-green-500 hover:bg-green-700 p-3 rounded-lg font-bold">Create Event</button>
                </form>
            </div>
        </div>
    );
}

export default AdminCreateEvent;