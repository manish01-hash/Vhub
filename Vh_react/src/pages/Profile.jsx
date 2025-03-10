import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaUniversity, FaUserGraduate, FaBriefcase, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Profile() {
    const { user, loading } = useAuth(); 
    const [editMode, setEditMode] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        college_name: user?.college_name || "",
        faculty: user?.faculty || "",
        year_of_study: user?.year_of_study || "",
        role: user?.role || ""
    });

    // Debugging user data
    useEffect(() => {
        console.log("🔍 Debugging Profile:");
        console.log("Loading:", loading);
        console.log("User Data:", user);
    }, [loading, user]);

    const saveProfile = async () => {
        const token = localStorage.getItem("accessToken");
    
        const formData = new FormData();
        formData.append("name", updatedUser.name);
        formData.append("phone", updatedUser.phone);
        formData.append("college_name", updatedUser.college_name);
        formData.append("faculty", updatedUser.faculty);
        formData.append("year_of_study", updatedUser.year_of_study);
    
        // ✅ Check if profile image is a new file before appending
        if (updatedUser.profile_image && updatedUser.profile_image instanceof File) {
            formData.append("profile_image", updatedUser.profile_image);
        }
    
        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/users/${user.id}/update/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("✅ Profile updated successfully!", response.data);
            
            // ✅ Update user state with new data
            setUpdatedUser(response.data.user);
    
            // ✅ Exit edit mode
            setEditMode(false);
        } catch (error) {
            console.error("❌ Error updating profile:", error.response ? error.response.data : error);
        }
    };
    
    

    // Handle Input Change
    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    // Toggle Edit Mode
    const toggleEdit = () => setEditMode(!editMode);

    if (loading) return <p className="text-center text-white">⏳ Loading profile...</p>;

    if (!user) {
        console.error("🚨 Unauthorized: User data is null. Check API or token.");
        return <p className="text-center text-red-500">❌ Unauthorized. Please log in.</p>;
    }

    return (
        <div className="flex justify-center items-center h-full w-full bg-gradient-to-br from-[#1c202c] to-[#283046] p-6">
            <div className="bg-[#2a2d3e] text-white p-6 rounded-lg shadow-lg w-full max-w-lg border border-gray-700 relative">
                {/* Edit Profile Button */}
                <button 
                    onClick={toggleEdit} 
                    className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2"
                >
                    <FaEdit />
                    <span>{editMode ? "Cancel" : "Edit Profile"}</span>
                </button>

                {/* Profile Details */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-400">{updatedUser.name}</h2>
                    <p className="text-gray-400 text-sm">{updatedUser.role}</p>
                </div>

                <div className="mt-6 space-y-4">
                    {/* Email */}
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaEnvelope className="text-yellow-400" />
                        {editMode ? (
                            <input 
                                type="email" 
                                name="email" 
                                value={updatedUser.email} 
                                onChange={handleChange} 
                                className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                            />
                        ) : (
                            <p>{updatedUser.email || "Email not available"}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaPhone className="text-blue-400" />
                        {editMode ? (
                            <input 
                                type="text" 
                                name="phone" 
                                value={updatedUser.phone} 
                                onChange={handleChange} 
                                className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                            />
                        ) : (
                            <p>{updatedUser.phone || "Not Provided"}</p>
                        )}
                    </div>

                    {/* College Name */}
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaUniversity className="text-green-400" />
                        {editMode ? (
                            <input 
                                type="text" 
                                name="college_name" 
                                value={updatedUser.college_name} 
                                onChange={handleChange} 
                                className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                            />
                        ) : (
                            <p>{updatedUser.college_name || "Not Provided"}</p>
                        )}
                    </div>

                    {/* Faculty */}
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaBriefcase className="text-purple-400" />
                        {editMode ? (
                            <input 
                                type="text" 
                                name="faculty" 
                                value={updatedUser.faculty} 
                                onChange={handleChange} 
                                className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                            />
                        ) : (
                            <p>{updatedUser.faculty || "Not Provided"}</p>
                        )}
                    </div>

                    {/* Year of Study */}
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaUserGraduate className="text-orange-400" />
                        {editMode ? (
                            <input 
                                type="text" 
                                name="year_of_study" 
                                value={updatedUser.year_of_study} 
                                onChange={handleChange} 
                                className="bg-gray-700 text-white px-3 py-1 rounded-md w-full"
                            />
                        ) : (
                            <p>{updatedUser.year_of_study || "Not Provided"}</p>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                {editMode && (
                    <button
                        onClick={()=>(toggleEdit(),saveProfile())}
                        className="mt-6 w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg transition-all"
                    >
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
}

export default Profile;