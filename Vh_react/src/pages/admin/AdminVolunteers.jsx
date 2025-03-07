import React, { useEffect, useState } from "react";
import { FaUserShield, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminVolunteers({}) {
    const [volunteers, setVolunteers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [backupVolunteers, setBackupVolunteers] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://127.0.0.1:8000/api/volunteers/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setVolunteers(response.data);
                setBackupVolunteers(response.data);
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
                                volunteers.map((volunteer) => (
                                    <tr key={volunteer.id} className="border-b border-gray-700">
                                        <td className="p-2">{volunteer.name}</td>
                                        <td className="p-2">{volunteer.email}</td>
                                        <td className="p-2">{volunteer.phone || "N/A"}</td>
                                        <td className="p-2">{volunteer.role}</td>
                                        <td className="p-2">
                                            <button
                                            onClick={()=>handleAssignRole(volunteer.id)}
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

export default AdminVolunteers;
