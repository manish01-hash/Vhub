import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [qrVisible, setQrVisible] = useState(false);

    useEffect(() => {
        console.log(`📌 Fetching details for Event ID: ${eventId}`);
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log("🟡 Fetching Event Details...");

            const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Event Details Fetched:", response.data);
            setEvent(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch event details:", error);
            setErrorMessage("Failed to load event details. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    const generateQrCode = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log(`🟡 Generating QR Code for Event ID: ${eventId}`);

            const response = await axios.get(
                `http://127.0.0.1:8000/api/events/${eventId}/generate-qr/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ QR Code Response:", response.data);

            if (response.data.message) {
                Swal.fire("Info", response.data.message, "info");
            }

            if (response.data.qr_code_url) {
                setQrCodeUrl(response.data.qr_code_url);
                setQrVisible(true);
            }
        } catch (error) {
            console.error("❌ Failed to generate QR Code:", error);
            Swal.fire("Error", "Failed to generate QR Code.", "error");
        }
    };

    if (loading) return <p className="text-center text-white">Loading event details...</p>;
    if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1c202c] to-[#283046] p-6">
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
                            <li key={coord.id} className="py-1 border-b border-gray-600">
                                {coord.name} <span className="text-green-400">(Coordinator)</span>
                            </li>
                        ))}
                        {event.E_Super_Volunteers.map(sv => (
                            <li key={sv.id} className="py-1 border-b border-gray-600">
                                {sv.name} <span className="text-purple-400">(Super Volunteer)</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No coordinators or super volunteers assigned yet.</p>
                )}

                <div className="mt-6 flex flex-col items-center">
                    {qrCodeUrl ? (
                        <button onClick={() => setQrVisible(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all">
                            Show QR Code
                        </button>
                    ) : (
                        <button onClick={generateQrCode} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all">
                            Generate QR Code
                        </button>
                    )}
                </div>

                {qrVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h2 className="text-xl font-bold mb-4">Your Event QR Code</h2>
                            {qrCodeUrl ? (
                                <img src={qrCodeUrl} alt="QR Code" className="border border-gray-500 p-2 rounded-lg shadow-md" />
                            ) : (
                                <p className="text-lg text-gray-700">No QR Code available.</p>
                            )}
                            <button onClick={() => setQrVisible(false)} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventDetails;