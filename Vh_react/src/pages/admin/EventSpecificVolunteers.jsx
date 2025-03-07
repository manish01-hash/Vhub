import React, { useEffect, useState } from "react";
import { FaUserShield, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "./Sidebar";

function EventSpecificVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [backupVolunteers, setBackupVolunteers] = useState([]);
    const { eventId, updateEventId } = useAuth();
    
    const navigate = useNavigate();


    
    function filterVolunteersByEventId(registrations) { 
        const filteredVolunteers = registrations.filter((registration) => (
            registration.event.E_ID === eventId
        ))

        setVolunteers(filteredVolunteers);
        console.log( "Filtered volunteers:",filteredVolunteers)
    }

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                console.log(eventId)
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://127.0.0.1:8000/api/registrations/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setVolunteers(response.data);
                setBackupVolunteers(response.data);
                filterVolunteersByEventId(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("❌ Error fetching volunteers:", error);
            }
        };
        
        fetchVolunteers();
    }, []);

    useEffect(() => {
        if (searchQuery.length === 0) {
            setVolunteers(backupVolunteers);
        } else {
            const searchedVolunteers = backupVolunteers.filter((volunteer) =>
                volunteer.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setVolunteers(searchedVolunteers);
        }
    }, [searchQuery]);


    function handleAssignRole(id) {
        console.log("Assigning role to volunteer with ID:", id);
    }

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            {/* ✅ Sidebar Navigation */}
            <Sidebar />

            {/* ✅ Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6">Manage Volunteers</h1>

                {/* ✅ Search Bar */}
                <div className="flex items-center bg-gray-700 p-3 rounded-lg w-[40%] mb-6">
                    <FaSearch className="text-gray-300 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Search volunteers..." 
                        className="bg-transparent focus:outline-none text-white w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* ✅ Volunteers Table */}
                <div className="bg-[#2d3748] p-6 rounded-lg shadow-md">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Phone</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(volunteers) && volunteers.length > 0 ? (
                                volunteers.map((registration) => (
                                    <tr key={registration.R_ID} className="border-b border-gray-700">
                                        <td className="p-2">{registration.volunteer.name}</td>
                                        <td className="p-2">{registration.volunteer.email}</td>
                                        <td className="p-2">{registration.volunteer.phone || "N/A"}</td>
                                        <td className="p-2">{registration.volunteer.role}</td>
                                        <td className="p-2">
                                            <button
                                            onClick={()=>handleAssignRole(registration.id)}
                                            className="text-blue-400 hover:text-blue-600 mr-3">
                                                <FaUserShield /> Assign Role
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center">No volunteers available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EventSpecificVolunteers;
