import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaTasks } from "react-icons/fa";

function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [qrVisible, setQrVisible] = useState(false);
    const [certificateAvailable, setCertificateAvailable] = useState(false);
    const [certificateUrl, setCertificateUrl] = useState("");
    const [tasks, setTasks] = useState([]);
    const [tasksVisible, setTasksVisible] = useState(false);
    const[backupTasks,setBackupTasks] = useState([])


    useEffect(() => {
        fetchEventDetails();
        checkCertificate();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            console.log("📡 Fetching event details...");
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvent(response.data);
            console.log("✅ Event data:", response.data);
        } catch (error) {
            console.error("❌ Failed to load event details:", error);
            setErrorMessage("Failed to load event details. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    const generateQrCode = async () => {
        try {
            console.log("📡 Generating QR Code...");
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/events/${eventId}/generate-qr/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.qr_code_url) {
                setQrCodeUrl(response.data.qr_code_url);
                setQrVisible(true);
                console.log("✅ QR Code URL:", response.data.qr_code_url);
            }
        } catch (error) {
            console.error("❌ Failed to generate QR Code:", error);
        }
    };

    const checkCertificate = async () => {
        try {
            console.log("📡 Checking certificate...");
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/events/${eventId}/check-certificate/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("✅ Certificate Response:", response.data);
            if (response.data.certificate_url) {
                setCertificateAvailable(true);
                setCertificateUrl(response.data.certificate_url);
                console.log("🎉 Certificate Available at:", response.data.certificate_url);
            } else {
                setCertificateAvailable(false);
            }
        } catch (error) {
            if (error.response) {
                console.error("🔍 Response Data:", error.response.data);
                console.error("🔍 Status Code:", error.response.status);
    
                if (error.response.status === 404) {
                    console.warn("🔴 No certificate found. Generating now...");
                    await generateCertificate(); // Auto-generate only if not found
                } else if (error.response.status === 403) {
                    console.warn("🔴 User is not allowed to generate the certificate.");
                    // alert("You are not eligible to generate a certificate.");
                    setCertificateAvailable(false);
                }                
            }
        }
    };
    
    const generateCertificate = async () => {
        try {
            console.log("📡 Generating new certificate...");
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                `http://127.0.0.1:8000/api/events/${eventId}/generate-certificate/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("🎉 Certificate Generated:", response.data);

            if (response.data.certificate_url) {
                setCertificateAvailable(true);
                setCertificateUrl(response.data.certificate_url);
                console.log("✅ Certificate successfully generated:", response.data.certificate_url);
                alert("Certificate generated successfully! You can now download it.");
            } else {
                console.warn("⚠️ Certificate generation succeeded, but no URL was returned.");
            }
        } catch (error) {
            console.error("❌ Certificate generation failed:", error);
            alert("Failed to generate certificate. Please try again later.");
        }
    };


    const downloadCertificate = () => {
    if (!certificateUrl) {
        console.warn("❌ No certificate URL available. Please generate it first.");
        alert("Certificate is not available. Try generating it first.");
        return;
    }

    // ✅ Ensure the URL is correct
    let fullUrl = certificateUrl.startsWith("http") ? certificateUrl : `http://127.0.0.1:8000${certificateUrl}`;
    
    console.log("📥 Opening certificate:", fullUrl);

    // ✅ Open the certificate in a new tab
    window.open(fullUrl, "_blank");
};

const fetchTasks = async () => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/tasks/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(response.data);
        setBackupTasks(response.data);
        setTasksVisible(true)

        console.log("✅ Fetching tasks...");
    } catch (error) {
        console.error("❌ Error fetching tasks:", error);
    }
};

// ✅ Log `tasks` AFTER it updates
useEffect(() => {
    console.log("Updated Tasks:", tasks);
}, [tasks]);


    const hasEventEnded = event?.E_End_Date && new Date(event.E_End_Date).getTime() <= Date.now();

    if (loading) return <p className="text-center text-white">Loading event details...</p>;
    if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-6">
            <div className="p-6 max-w-4xl mx-auto bg-gray-800 text-white shadow-lg rounded-lg border border-gray-700">

                <h2 className="text-4xl font-bold text-blue-400 border-b border-gray-600 pb-2">{event?.E_Name}</h2>
                <p className="mt-4 text-gray-300">{event?.E_Description}</p>

                <div className="text-sm text-gray-400 mt-2 space-y-1">
                    <p>Status: <span className="text-yellow-400">{event?.E_Status}</span></p>
                    <p>Location: {event?.E_Location}</p>
                    <p>Date: {event?.E_Start_Date} - {event?.E_End_Date}</p>
                </div>

                {event?.E_Photo && (
                    <img src={event.E_Photo} alt="Event" className="mt-4 rounded-lg w-full h-60 object-cover shadow-md" />
                )}

                <div className="mt-6 flex flex-col items-center">
                    {qrCodeUrl ? (
                        <button
                            onClick={() => setQrVisible(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
                        >
                            Show QR Code
                        </button>
                    ) : (
                        <button
                            onClick={generateQrCode}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
                        >
                            Generate QR Code
                            </button>
                        
                    )}

                    <button onClick={fetchTasks} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all">
                        <FaTasks /> <span>View Tasks</span>
                    </button>
                    
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
                            <button
                                onClick={() => setQrVisible(false)}
                                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {certificateAvailable && hasEventEnded && (
                    <div className="mt-6 flex flex-col items-center">
                        <button
                            onClick={downloadCertificate}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
                        >
                            Download Certificate
                        </button>
                    </div>
                )}

            {tasksVisible && (
                    <div className="absolute top-0 right-0 w-64 h-full bg-gray-800 p-4 shadow-lg transform translate-x-0 transition-transform">
                        <h3 className="text-xl font-bold text-white mb-4">Event Tasks</h3>
                        <ul className="text-gray-300">
                            {tasks.length > 0 ? tasks.map(task => (
                                <li key={task.id} className="py-2 border-b text-center text-xl  border-gray-600">{task.title.charAt(0).toUpperCase() + task.title.slice(1).toLowerCase()}</li>
                            )) : <p>No tasks available.</p>}
                        </ul>
                        <button onClick={() => setTasksVisible(false)} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full">Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
