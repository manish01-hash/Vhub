import { useEffect, useState } from "react";
import axios from "axios";

const AssignRole = ({ userId, eventId, currentRole, setVolunteers }) => {
    const [role, setRole] = useState(currentRole || "Loading...");  // ✅ Set default role

    const [loading, setLoading] = useState(false);

    // ✅ Ensure the role is updated when `currentRole` changes
    useEffect(() => {
        if (currentRole) {
            setRole(currentRole);
        }
    }, [currentRole]);

    const handleRoleChange = async (newRole) => {
        if (!newRole || newRole === role) return; // ✅ Prevent unnecessary API calls

        try {
            setLoading(true);
            setRole(newRole); // ✅ Optimistically update UI before API call
            const token = localStorage.getItem("accessToken");

            const apiUrl = `http://127.0.0.1:8000/api/events/${eventId}/update-role/`;

            const response = await axios.patch(
                apiUrl, 
                { user_id: userId, role: newRole }, 
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`, 
                        "Content-Type": "application/json"
                    } 
                }
            );

            if (response.status === 200) {
                setRole(newRole); // ✅ Keep UI updated

                // ✅ Update volunteers state in real-time
                setVolunteers((prevVolunteers) =>
                    prevVolunteers.map((vol) =>
                        vol.volunteer.id === userId && vol.event.E_ID === eventId
                            ? { ...vol, role: newRole }  // ✅ Update only this event
                            : vol
                    )
                );
            } else {
                alert("❌ Role update failed.");
            }
        } catch (error) {
            console.error("❌ Error updating role:", error.response?.data || error.message);
            alert("❌ Failed to update role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-gray-700 p-2 rounded text-white"
            disabled={loading}
        >
            <option value="Loading..." disabled>Loading...</option>  {/* ✅ Fix empty dropdown issue */}
            <option value="Volunteer">Volunteer</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Super Volunteer">Super Volunteer</option>
            <option value="Event Organizer">Event Organizer</option>
        </select>
    );
};

export default AssignRole;
