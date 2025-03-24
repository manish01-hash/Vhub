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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setErrorMessage("❌ Please upload a valid image file (JPEG, PNG, etc.)");
                return;
            }
            
            // Validate file size (e.g., 5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("❌ Image size should be less than 5MB");
                return;
            }

            setEventData({ ...eventData, E_Photo: file });
            
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const currentDate = new Date().toISOString().split("T")[0];
        const errors = [];

        if (!eventData.E_Name.trim()) errors.push("Event name is required");
        if (!eventData.E_Description.trim()) errors.push("Description is required");
        if (!eventData.E_Location.trim()) errors.push("Location is required");
        if (!eventData.E_Photo) errors.push("Event photo is required");
        if (eventData.E_Required_Volunteers <= 0) errors.push("Volunteers must be positive");
        
        // Date validations
        if (!eventData.E_Start_Date) errors.push("Start date is required");
        if (!eventData.E_End_Date) errors.push("End date is required");
        
        if (eventData.E_Start_Date && eventData.E_Start_Date < currentDate) {
            errors.push("Start date cannot be in the past");
        }
        
        if (eventData.E_Start_Date && eventData.E_End_Date && eventData.E_End_Date < eventData.E_Start_Date) {
            errors.push("End date cannot be before start date");
        }
        
        if (eventData.E_Start_Date === eventData.E_End_Date && 
            eventData.E_Start_Time && eventData.E_End_Time && 
            eventData.E_End_Time <= eventData.E_Start_Time) {
            errors.push("End time must be after start time for same-day events");
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrorMessage(validationErrors.join(". ") + ".");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        Object.keys(eventData).forEach((key) => {
            if (eventData[key] !== null) {
                formData.append(key, eventData[key]);
            }
        });

        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                "https://vhub-zb2y.onrender.com/api/events/create/", 
                formData, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 201) {
                navigate("/admin/events");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            let errorMsg = "❌ Error creating event. Please try again.";
            
            if (error.response) {
                if (error.response.data?.E_Photo) {
                    errorMsg = `❌ Image error: ${error.response.data.E_Photo[0]}`;
                } else if (error.response.data?.detail) {
                    errorMsg = `❌ ${error.response.data.detail}`;
                }
            }
            
            setErrorMessage(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6">Create New Event</h1>
                <form onSubmit={handleSubmit} className="bg-[#2d3748] p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    {/* Existing form fields remain the same */}
                    <label className="block mb-2">Event Name:</label>
                    <input type="text" name="E_Name" value={eventData.E_Name} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    {/* ... other fields ... */}
                    
                    <label className="block mb-2">Event Photo:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        required 
                        className="w-full p-2 mb-4 bg-gray-700 rounded" 
                    />
                    {previewImage && (
                        <div className="mb-4">
                            <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="max-w-full h-auto max-h-40 rounded" 
                            />
                        </div>
                    )}

                    {/* Error message display */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-900 rounded text-red-200">
                            {errorMessage}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full p-3 rounded-lg font-bold ${
                            isSubmitting 
                                ? "bg-gray-500 cursor-not-allowed" 
                                : "bg-green-500 hover:bg-green-700"
                        }`}
                    >
                        {isSubmitting ? "Creating..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminCreateEvent;