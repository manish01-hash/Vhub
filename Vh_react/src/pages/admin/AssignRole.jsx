import { useState } from "react";
import axios from "axios";

const AssignRole = ({ userId }) => {
    const [role, setRole] = useState("Select Role");
    const [loading, setLoading] = useState(false); // ✅ Disable dropdown while updating

    const handleRoleChange = async (newRole) => {
        if (!newRole || newRole === role) return; // ✅ Prevent unnecessary API calls

        try {
            setLoading(true);
            setRole(newRole)
            const token = localStorage.getItem("accessToken");

            // ✅ Correct API path (must match `urls.py`)
            const apiUrl = `http://127.0.0.1:8000/api/users/update-role/${userId}/`;

            const response = await axios.patch(
                apiUrl, 
                { role: newRole }, 
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`, // ✅ Fix 401 error
                        "Content-Type": "application/json"
                    } 
                }
            );

            if (response.status === 200) {
                setRole(newRole); // ✅ Update UI after success
                window.location.reload();

            }
        } catch (error) {
            console.error("❌ Error updating role:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-gray-700 p-2 rounded text-white"
            disabled={loading} // ✅ Prevent spam clicking
        >
            <option value="Select Role">Select Role</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Super Volunteer">Super Volunteer</option>
            <option value="Event Organizer">Event Organizer</option>
        </select>
    );
};

export default AssignRole;