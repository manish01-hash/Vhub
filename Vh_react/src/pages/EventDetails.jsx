import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarLayout from "../components/SidebarLayout";

function EventRegistration() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [volunteerDetails, setVolunteerDetails] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        year: "",
        skills: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setVolunteerDetails({ ...volunteerDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!volunteerDetails.name || !volunteerDetails.email || !volunteerDetails.phone) {
            alert("⚠️ Please fill in all required fields.");
            setLoading(false);
            return;
        }
    
        console.log("🟢 Sending Registration Data:", volunteerDetails);
    
        try {
            const token = localStorage.getItem("accessToken");
            console.log("🔑 Access Token:", token);
    
            const response = await axios.post(
                `http://127.0.0.1:8000/api/events/${eventId}/register/`,
                volunteerDetails,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("🔄 Response Status:", response.status);
            
            if (response.status === 201) {
                alert("✅ Registered Successfully!");
                console.log("✅ Navigating to:", `/events/${eventId}`);
                navigate(`/events/${eventId}`);
            } else {
                alert("⚠️ Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("❌ Registration failed:", error.response?.data || error.message);
            alert("❌ Registration failed. Check console for details.");
        }
        setLoading(false);
    };
    

    return (
        <SidebarLayout>
            <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center">Register for Event</h2>
                <p className="text-gray-600 text-center mb-4">Fill in your details to participate</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" className="w-full p-2 border rounded" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email Address" className="w-full p-2 border rounded" onChange={handleChange} required />
                    <input type="tel" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded" onChange={handleChange} required />
                    <input type="text" name="college" placeholder="College Name" className="w-full p-2 border rounded" onChange={handleChange} />
                    <input type="text" name="year" placeholder="Year of Study" className="w-full p-2 border rounded" onChange={handleChange} />
                    <textarea name="skills" placeholder="List Your Skills" className="w-full p-2 border rounded" onChange={handleChange}></textarea>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg" disabled={loading}>
                        {loading ? "Registering..." : "Submit Registration"}
                    </button>
                </form>
            </div>
        </SidebarLayout>
    );
}

export default EventRegistration;
