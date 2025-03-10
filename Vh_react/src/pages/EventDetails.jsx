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
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        fetchEventDetails();
    }, []);

    function showAlert(message, type = "error") {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(null), 3000);
    }

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
            showAlert("QR Code generated successfully!", "success");
        } catch (error) {
            showAlert("Error generating QR Code", "error");
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
            showAlert("Announcement posted successfully!", "success");
        } catch (error) {
            showAlert("Error posting announcement. You may not have permission.", "error");
        }
    }

    if (loading) return <p className="text-center text-white">Loading event details...</p>;
    if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1c202c] to-[#283046] p-6 relative">
            {alertMessage && (
                <div className={`absolute top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white ${alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                    {alertMessage.message}
                </div>
            )}
            <div className="p-6 max-w-4xl mx-auto bg-[#2a2d3e] text-white shadow-lg rounded-lg border border-gray-700">
                <h2 className="text-4xl font-bold text-blue-400 border-b border-gray-600 pb-2">{event.E_Name}</h2>
                <p className="mt-4 text-gray-300">{event.E_Description}</p>
                <p className="text-sm text-gray-400 mt-2">Status: <span className="text-yellow-400">{event.E_Status}</span></p>
                <p className="text-sm text-gray-400">Location: {event.E_Location}</p>
                <p className="text-sm text-gray-400">Date: {event.E_Start_Date} - {event.E_End_Date}</p>
                {event.E_Photo && <img src={event.E_Photo} alt="Event" className="mt-4 rounded-lg w-full h-60 object-cover shadow-md" />}
                
                <h3 className="mt-6 text-xl font-semibold text-green-400">Volunteers: {event.E_Volunteers.length}/{event.E_Required_Volunteers}</h3>
                <h3 className="mt-2 text-xl font-semibold text-blue-300">Coordinators & Super Volunteers</h3>
                {event.E_Coordinators.length > 0 || event.E_Super_Volunteers.length > 0 ? (
                    <ul className="mt-2 text-gray-300">
                        {event.E_Coordinators.map(coord => (
                            <li key={coord.id} className="py-1 border-b border-gray-600">{coord.name} <span className="text-green-400">(Coordinator)</span></li>
                        ))}
                        {event.E_Super_Volunteers.map(sv => (
                            <li key={sv.id} className="py-1 border-b border-gray-600">{sv.name} <span className="text-purple-400">(Super Volunteer)</span></li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No coordinators or super volunteers assigned yet.</p>
                )}

                <div className="mt-6 flex flex-col items-center">
                    <button onClick={generateQrCode} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all">Generate QR Code</button>
                    {qrCode && <img src={qrCode} alt="QR Code" className="mt-4 border border-gray-500 p-2 rounded-lg shadow-md" />}
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-yellow-400">Event Announcements</h3>
                    <div className="mt-2 space-y-2">
                        {event.announcements.map(ann => (
                            <p key={ann.A_ID} className="border border-gray-600 p-2 rounded-lg bg-[#25283b] text-gray-300">
                                {ann.message} <span className="text-gray-500 text-sm"> - {ann.posted_by.name}</span>
                            </p>
                        ))}
                    </div>
                    <div className="mt-4">
                        <input type="text" value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} placeholder="Post an announcement..." className="border border-gray-600 bg-[#1f2233] px-3 py-2 rounded w-full mt-2 text-white" />
                        <button onClick={postAnnouncement} className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all">Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;
