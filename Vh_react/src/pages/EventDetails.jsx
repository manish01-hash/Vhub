import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [qrCode, setQrCode] = useState(null);
    const [newAnnouncement, setNewAnnouncement] = useState("");

    useEffect(() => {
        fetchEventDetails();
    }, []);

    async function fetchEventDetails() {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvent(response.data);
        } catch (error) {
            setErrorMessage("Failed to load event details. Try again later.");
        } finally {
            setLoading(false);
        }
    }

    async function generateQrCode() {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/qr/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQrCode(response.data.qr_code_url);
        } catch (error) {
            alert("Error generating QR Code");
        }
    }

    async function postAnnouncement() {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                `http://127.0.0.1:8000/api/events/${eventId}/announcements/`,
                { message: newAnnouncement },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewAnnouncement("");
            fetchEventDetails(); // Refresh announcements
        } catch (error) {
            alert("Error posting announcement. You may not have permission.");
        }
    }

    if (loading) return <p>Loading event details...</p>;
    if (errorMessage) return <p className="text-red-500">{errorMessage}</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold">{event.E_Name}</h2>
                <p className="text-gray-600">{event.E_Description}</p>
                <p className="text-sm text-gray-500">Status: {event.E_Status}</p>
                <p className="text-sm text-gray-500">Location: {event.E_Location}</p>
                <p className="text-sm text-gray-500">Date: {event.E_Start_Date} - {event.E_End_Date}</p>
                {event.E_Photo && <img src={event.E_Photo} alt="Event" className="mt-4 rounded-lg w-full h-60 object-cover" />}
                
                <h3 className="mt-6 text-xl font-semibold">Volunteers: {event.E_Volunteers.length}/{event.E_Required_Volunteers}</h3>
                <h3 className="mt-2 text-xl font-semibold">Coordinators & Super Volunteers</h3>
                {event.E_Coordinators.length > 0 || event.E_Super_Volunteers.length > 0 ? (
                    <ul>
                        {event.E_Coordinators.map(coord => (
                            <li key={coord.id} className="text-gray-700">{coord.name} (Coordinator)</li>
                        ))}
                        {event.E_Super_Volunteers.map(sv => (
                            <li key={sv.id} className="text-gray-700">{sv.name} (Super Volunteer)</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No coordinators or super volunteers assigned yet.</p>
                )}

                <div className="mt-6">
                    <button onClick={generateQrCode} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Generate QR Code</button>
                    {qrCode && <img src={qrCode} alt="QR Code" className="mt-4" />}
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Event Announcements</h3>
                    {event.announcements.map(ann => (
                        <p key={ann.A_ID} className="border-b py-2">{ann.message} - <span className="text-gray-500 text-sm">{ann.posted_by.name}</span></p>
                    ))}
                    <input type="text" value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} placeholder="Post an announcement..." className="border px-2 py-1 rounded w-full mt-2" />
                    <button onClick={postAnnouncement} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">Post</button>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;