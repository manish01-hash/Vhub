import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EventPost from "./EventPost";
import { FaSearch, FaFilter } from "react-icons/fa";

function MyEvents() {
    const { user } = useAuth(); 
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [backupEvents,setBackupEvents] = useState([])
    const[allEvents,setAllEvents] = useState([])

    useEffect(() => {
        fetchMyEvents();
    }, []);

   useEffect(() => {
               console.log("🟡 Current Filter Value = ", filter);
               setAllEvents(backupEvents)
       
               const filtered = allEvents.filter(event => filter==="All" || event.E_Status === filter);
       
               setMyEvents(filtered);
               setAllEvents(backupEvents)
       
               console.log("✅ Events Fetched",myEvents)
           }, [filter]); // Depend on allEvents to avoid data loss
   

    async function fetchMyEvents() {
        try {
            console.log("🟡 Fetching my events...");
            const response = await axios.get("http://127.0.0.1:8000/api/my-events/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });

            if (response.data.length === 0) {
                setErrorMessage("You are not involved in any events yet.");
                setMyEvents([]);
            } else {
                setMyEvents(response.data);
                setBackupEvents(response.data)
                setAllEvents(response.data)
                setErrorMessage("");
            }
        } catch (error) {
            console.error("❌ Error fetching my events:", error.response?.status, error.response?.data);
            setErrorMessage("Failed to load your events.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-full w-full p-3">
            <nav className="bg-[#2d3748] p-4 rounded-lg shadow-md flex items-center h-[10%] justify-between">
                <div className="flex items-center bg-[#1a202c] h-full px-4 py-2 rounded-lg w-[40%]">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Search my events..." 
                        className="bg-transparent text-white w-full focus:outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center bg-[#1a202c] px-4 py-2 rounded-lg">
                    <FaFilter className="text-gray-400 mr-2" />
                    <select 
                        className="bg-transparent focus:outline-none"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All" className="text-white bg-[#1a202c]">All My Events</option>
                        <option value="Upcoming" className="text-black">Upcoming</option>
                        <option value="Ongoing" className="text-black">Ongoing</option>
                        <option value="Completed" className="text-black">Completed</option>
                    </select>
                </div>
            </nav>

            {loading ? (
                <div className="text-center mt-10">
                    <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                    <p className="mt-3 text-gray-300">Loading your events...</p>
                </div>
            ) : (
                <>
                    {errorMessage ? (
                        <div className="text-center mt-10 font-bold text-blue-400">
                            <p className="text-xl">{errorMessage}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {myEvents
                                .filter(event => filter === "All" || event.E_Status === filter)
                                .filter(event => event.E_Name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(event => (
                                    <div key={event.E_ID} className="bg-[#2a3b4f] rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105">
                                        <EventPost 
                                            ename={event.E_Name} 
                                            event={event}  
                                            description={event.E_Description} 
                                            requiredVolunteers={event.E_Required_Volunteers} 
                                            totVolunteers={event.E_Volunteers?.length || 0} 
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MyEvents;
