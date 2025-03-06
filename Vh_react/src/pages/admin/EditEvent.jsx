import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

function EditEvent({ eventId, closeModal, refreshEvents }) {
    const [eventData, setEventData] = useState({
        E_Name: "",
        E_Description: "",
        E_Start_Date: "",
        E_End_Date: "",
        E_Location: "",
        E_Required_Volunteers: 10,
        E_Status: "Upcoming",
        E_Photo: null,
        existingPhoto: ""
    });
    
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const token = localStorage.getItem("accessToken");
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/`, { headers });
                
                // ✅ Fix Date Format Before Setting State
                const formattedData = {
                    ...response.data,
                    E_Start_Date: response.data.E_Start_Date ? response.data.E_Start_Date.split("T")[0] : "",
                    E_End_Date: response.data.E_End_Date ? response.data.E_End_Date.split("T")[0] : ""
                };
    
                setEventData(formattedData);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        }
        fetchEvent();
    }, [eventId]);
    
    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setEventData({ ...eventData, E_Photo: file });
        setPreview(URL.createObjectURL(file)); // ✅ Preview new image
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = { 
                Authorization: `Bearer ${token}`
            };
    
            const formData = new FormData();
    
            // ✅ Add only non-empty fields to FormData
            Object.entries(eventData).forEach(([key, value]) => {
                if (key === "E_Photo") {
                    if (value instanceof File) {
                        formData.append("E_Photo", value);
                    }
                } else if (value !== "" && value !== null && key !== "existingPhoto") {
                    formData.append(key, value);
                }
            });
    
            const response = await axios.put(
                `http://127.0.0.1:8000/api/events/update/${eventId}/`, 
                formData, 
                { headers }
            );
    
            alert("Event updated successfully!");
            refreshEvents();
            closeModal();
        } catch (error) {
            console.error("Error updating event:", error);
            alert(`Update Failed: ${JSON.stringify(error.response?.data)}`);
        }
    };
    
    
    

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Edit Event</h2>
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
                
                {/* Show existing event image */}
                {eventData.existingPhoto && !preview && (
                    <img src={eventData.existingPhoto} alt="Event" className="w-full h-40 object-cover rounded mb-2" />
                )}
                
                {/* Show new preview image if selected */}
                {preview && (
                    <img src={preview} alt="New Preview" className="w-full h-40 object-cover rounded mb-2" />
                )}
                
                <input type="file" accept="image/*" className="w-full p-2 border rounded mb-2" onChange={handleFileChange} />
                <button onClick={handleUpdate} className="w-full bg-green-500 text-white p-2 rounded">Update Event</button>
            </div>
        </div>
    );
}

export default EditEvent;
