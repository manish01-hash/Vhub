import React, {useState} from "react";
import { Link } from "react-router-dom";

function EventPost({ event, ename, description, requiredVolunteers, totVolunteers,  }) { 
    
    const [apply, setApply] = useState(true)
    const [exit,setExit] = useState(false)

    function handleAdd() {
        setApply(false)
        setExit(true)
    }

    const handleRemove = async (eventId) => {
        try {
            setExit(false)
            setApply(true)
            await axios.post(`http://127.0.0.1:8000/api/events/${eventId}/leave/`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            });
            fetchEvents(); // Refresh event list
        } catch (error) {
            console.error("❌ Error removing from event:", error);
        }
    };


    return (
        <div className=" bg-gray-300">
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3DNasCvfOLMIxJyQtbNq7EfLkWnMazHE9xw&s" alt={ename} className="w-full h-40 object-cover rounded-md" />
                                        <h2 className="text-2xl font-semibold mt-3">{ename}</h2>
                                        <p className="text-gray-600">{description.substring(0, 100)}...</p>
                                        <p className="mt-2 text-blue-600 font-semibold">Volunteers: {totVolunteers}/{requiredVolunteers}</p>
                                        
                                        {/* ✅ Remove from Event Button */}
                                        {
                                            exit && <button 
                                            onClick={() => handleRemove(event.E_ID)} 
                                            className="mt-4 bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-lg">
                                            Exit Event
                                        </button>
                                        }
                                        {
                                            apply && <button 
                                            onClick={() => handleAdd(event.E_ID)} 
                                            className="mt-4 bg-green-500 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
                                            Join Event
                                        </button>
                                        }

                                        {/* ✅ View Tasks Button */}
                                        <Link to={`/events/${event.E_ID}/tasks`} className="text-md font-bold mt-2 block text-center bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                                            View Event
                                        </Link>
        </div>
   )
}

export default EventPost;