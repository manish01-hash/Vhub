import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaUniversity, FaUserGraduate, FaBriefcase, FaEdit, FaCertificate, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function Profile() {
    const { user, loading, fetchProfile } = useAuth(); 
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        user: {
            name: "",
            email: "",
            phone: "",
            college_name: "",
            faculty: "", 
            year_of_study: "", 
            role: "",
            profile_image: ""
        },
        stats: {
            events_attended: 0
        },
        recent_certificates: [],
        profile_completion: 0
    });
    const [updatedUser, setUpdatedUser] = useState({
        name: "",
        email: "",
        phone: "",
        college_name: "",
        faculty: "", 
        year_of_study: "", 
        profile_image: null
    });
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        console.log("🔍 Debugging Profile:");
        console.log("Loading:", loading);
        console.log("Profile Data:", profileData);
    }, [loading, profileData]);

    useEffect(() => {
        if (user) {
            setProfileData(user);
            setUpdatedUser({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                college_name: user.college_name || "",
                faculty: user.faculty || "", 
                year_of_study: user.year_of_study || "", 
                profile_image: user.profile_image || null
            });
            setImagePreview(user.profile_image || "");
        }
    }, [user]);

    const yearOfStudyText = (year) => {
        const yearMapping = {
            1: "First Year",
            2: "Second Year",
            3: "Third Year",
            4: "Fourth Year"
        };
        return yearMapping[year] || "Unknown Year";
    };

    const saveProfile = async () => {
        const token = localStorage.getItem("accessToken");
        const formData = new FormData();
        for (const key in updatedUser) {
            if (updatedUser[key] !== null && key !== "profile_image") {
                formData.append(key, updatedUser[key]);
            }
        }

        if (updatedUser.profile_image && updatedUser.profile_image instanceof File) {
            formData.append("profile_image", updatedUser.profile_image);
        }

        try {
            const response = await axios.patch(
                `https://vhub-zb2y.onrender.com/api/users/${profileData.id}/update/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("✅ Profile updated successfully!", response.data);
            fetchProfile(); // Refresh profile data
            setEditMode(false);
        } catch (error) {
            console.error("❌ Error updating profile:", error.response ? error.response.data : error);
        }
    };

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatedUser({ ...updatedUser, profile_image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleEdit = () => setEditMode(!editMode);

    if (loading) return <p className="text-center text-white">⏳ Loading profile...</p>;

    if (!profileData.user) {
        console.error("🚨 Unauthorized: User data is null. Check API or token.");
        return <p className="text-center text-red-500">❌ Unauthorized. Please log in.</p>;
    }

    return (
        <div className="flex justify-center items-start h-full w-full bg-gradient-to-br from-[#1c202c] to-[#283046] p-6">
            <div className="bg-[#2a2d3e] text-white p-6 rounded-lg shadow-lg w-full max-w-4xl border border-gray-700">
                {/* Profile Completion Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Profile Completion</span>
                        <span className="text-sm font-medium">{profileData.profile_completion}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                            className="bg-green-500 h-2.5 rounded-full" 
                            style={{ width: `${profileData.profile_completion}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="flex-1 bg-[#34384b] p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-center w-full">
                                <label htmlFor="profileImageUpload" className="cursor-pointer">
                                    <img 
                                        src={imagePreview || "/default-avatar.png"} 
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full mx-auto border border-gray-500"
                                    />
                                </label>
                                {editMode && (
                                    <input type="file" id="profileImageUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
                                )}
                                <h2 className="text-3xl font-bold text-green-400 mt-4">{profileData.user.name}</h2>
                                <p className="text-gray-400 text-sm">{profileData.user.role}</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <FaEnvelope className="text-yellow-400" />
                                {editMode ? (
                                    <input type="email" placeholder="Email" name="email" value={updatedUser.email} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                                ) : (
                                    <p>Email: {profileData.user.email}</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <FaPhone className="text-blue-400" />
                                {editMode ? (
                                    <input type="text" placeholder="Phone" name="phone" value={updatedUser.phone} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                                ) : (
                                    <p>Phone: {profileData.user.phone || "Not Provided"}</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <FaUniversity className="text-green-400" />
                                {editMode ? (
                                    <input type="text" placeholder="College" name="college_name" value={updatedUser.college_name} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                                ) : (
                                    <p>College: {profileData.user.college_name}</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <FaBriefcase className="text-purple-400" />
                                {editMode ? (
                                    <input type="text" placeholder="Faculty" name="faculty" value={updatedUser.faculty} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                                ) : (
                                    <p>Faculty: {profileData.user.faculty}</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <FaUserGraduate className="text-orange-400" />
                                {editMode ? (
                                    <input type="number" placeholder="Year of Study" name="year_of_study" value={updatedUser.year_of_study} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                                ) : (
                                    <p>Current Year: {yearOfStudyText(profileData.user.year_of_study)}</p>
                                )}
                            </div>
                        </div>

                        <button onClick={toggleEdit} className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2">
                            <span>{editMode ? "Cancel" : "Edit Profile"}</span>
                        </button>
                        {editMode && (
                            <button onClick={saveProfile} className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg transition-all">
                                Save Changes
                            </button>
                        )}
                    </div>

                    {/* Right Column - Stats and Certificates */}
                    <div className="flex-1 space-y-6">
                        {/* Statistics Card */}
                        <div className="bg-[#34384b] p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <FaChartBar className="mr-2 text-blue-400" /> Your Statistics
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                                    <span className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-green-400" />
                                        Events Attended
                                    </span>
                                    <span className="font-bold">{profileData.stats?.events_attended || 0}</span>
                                </div>
                                {/* Add more stats here as needed */}
                            </div>
                        </div>

                        {/* Certificates Card */}
                        <div className="bg-[#34384b] p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <FaCertificate className="mr-2 text-yellow-400" /> Recent Certificates
                            </h3>
                            {profileData.recent_certificates?.length > 0 ? (
                                <div className="space-y-3">
                                    {profileData.recent_certificates.map((cert, index) => (
                                        <div key={index} className="p-3 bg-gray-700 rounded-lg">
                                            <div className="font-medium">{cert.event_name}</div>
                                            <div className="text-sm text-gray-400">Issued: {cert.issued_date}</div>
                                            {cert.download_url && (
                                                <a 
                                                    href={cert.download_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 text-sm hover:underline mt-1 inline-block"
                                                >
                                                    Download Certificate
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No certificates yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;