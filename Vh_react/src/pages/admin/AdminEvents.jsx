import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import axios from "axios";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const token = localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get("http://127.0.0.1:8000/api/events/", { headers });
            
            // Ensure response is an array
            setEvents(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]); // Prevent undefined errors
        }
    }

    const handleEditClick = (eventId) => {
        setSelectedEventId(eventId);
        setShowEditModal(true);
    };

    const handleDeleteClick = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            const token = localStorage.getItem("accessToken");
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(`http://127.0.0.1:8000/api/events/delete/${eventId}/`, { headers });
            alert("Event deleted successfully!");
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const filteredEvents = Array.isArray(events)
        ? events.filter(event =>
            event?.E_Name?.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    const getImageUrl = (imagePath) => {
        return imagePath ? `http://127.0.0.1:8000${imagePath}` : "/default-image.jpg";
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Manage Events</h1>
                    <button onClick={() => setShowCreateModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                        <FaPlus className="mr-2" /> Add Event
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 mb-4 rounded-md border"
                />
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-3">Image</th>
                            <th className="p-3">Event Name</th>
                            <th className="p-3">Start Date</th>
                            <th className="p-3">End Date</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Volunteers Needed</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map(event => (
                                <tr key={event?.E_ID} className="border-t">
                                    <td className="p-3">
                                        {event?.E_Photo ? (
                                            <img
                                                src={getImageUrl(event?.E_Photo)}
                                                alt="Event"
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => e.target.src = "/default-image.jpg"}
                                            />
                                        ) : (
                                            <span className="text-gray-500">No Image</span>
                                        )}
                                    </td>
                                    <td className="p-3">{event?.E_Name || "N/A"}</td>
                                    <td className="p-3">{event?.E_Start_Date ? new Date(event.E_Start_Date).toLocaleDateString() : "N/A"}</td>
                                    <td className="p-3">{event?.E_End_Date ? new Date(event.E_End_Date).toLocaleDateString() : "N/A"}</td>
                                    <td className="p-3">{event?.E_Location || "N/A"}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-white ${
                                            event?.E_Status === "Upcoming" ? "bg-blue-500" :
                                            event?.E_Status === "Ongoing" ? "bg-green-500" :
                                            "bg-gray-500"
                                        }`}>
                                            {event?.E_Status || "N/A"}
                                        </span>
                                    </td>
                                    <td className="p-3">{event?.E_Required_Volunteers || "N/A"}</td>
                                    <td className="p-3 flex gap-2">
                                        <button onClick={() => handleEditClick(event?.E_ID)} className="bg-green-500 text-white px-3 py-1 rounded flex items-center">
                                            <FaEdit className="mr-1" /> Edit
                                        </button>
                                        <button onClick={() => handleDeleteClick(event?.E_ID)} className="bg-red-500 text-white px-3 py-1 rounded flex items-center">
                                            <FaTrash className="mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center p-4 text-gray-500">No events found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
            {showCreateModal && <CreateEvent closeModal={() => setShowCreateModal(false)} refreshEvents={fetchEvents} />}
            {showEditModal && <EditEvent eventId={selectedEventId} closeModal={() => setShowEditModal(false)} refreshEvents={fetchEvents} />}
        </div>
    );
}

export default AdminEvents;
