import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

function CreateEvent({ closeModal, refreshEvents }) {
    const [eventData, setEventData] = useState({
        E_Name: "",
        E_Description: "",
        E_Start_Date: "",
        E_End_Date: "",
        E_Location: "",
        E_Required_Volunteers: 10,
        E_Status: "Upcoming",
        E_Photo: null,
    });

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, E_Photo: e.target.files[0] });
    };

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${token}` };
            
            const formData = new FormData();
            for (const key in eventData) {
                formData.append(key, eventData[key]);
            }
            
            await axios.post("http://127.0.0.1:8000/api/events/create/", formData, { headers });
            alert("Event created successfully!");
            refreshEvents(); // Refresh event list in AdminEvents.jsx
            closeModal(); // Close modal after creation
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Create New Event</h2>
                    <button onClick={closeModal} className="text-red-500"><FaTimes /></button>
                </div>
                <input type="text" name="E_Name" placeholder="Event Name" className="w-full p-2 border rounded mb-2" value={eventData.E_Name} onChange={handleChange} />
                <textarea name="E_Description" placeholder="Description" className="w-full p-2 border rounded mb-2" value={eventData.E_Description} onChange={handleChange}></textarea>
                <input type="date" name="E_Start_Date" className="w-full p-2 border rounded mb-2" value={eventData.E_Start_Date} onChange={handleChange} />
                <input type="date" name="E_End_Date" className="w-full p-2 border rounded mb-2" value={eventData.E_End_Date} onChange={handleChange} />
                <input type="text" name="E_Location" placeholder="Location" className="w-full p-2 border rounded mb-2" value={eventData.E_Location} onChange={handleChange} />
                <input type="number" name="E_Required_Volunteers" placeholder="Volunteers Needed" className="w-full p-2 border rounded mb-2" value={eventData.E_Required_Volunteers} onChange={handleChange} />
                <select name="E_Status" className="w-full p-2 border rounded mb-2" value={eventData.E_Status} onChange={handleChange}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                </select>
                <input type="file" accept="image/*" className="w-full p-2 border rounded mb-2" onChange={handleFileChange} />
                <button onClick={handleCreate} className="w-full bg-blue-500 text-white p-2 rounded">Create Event</button>
            </div>
        </div>
    );
}

export default CreateEvent;
