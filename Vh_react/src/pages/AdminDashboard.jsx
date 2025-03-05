// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function AdminDashboard() {
//     const [volunteers, setVolunteers] = useState([]);
//     const [events, setEvents] = useState([]);
//     const navigate = useNavigate();

//     // Fetch Volunteers
//     useEffect(() => {
//         axios.get("http://127.0.0.1:8000/api/volunteers/", {
//             headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
//         }).then(response => {
//             setVolunteers(response.data);
//         }).catch(error => {
//             console.error("Error fetching volunteers:", error);
//         });
//     }, []);

//     // Fetch Events
//     useEffect(() => {
//         axios.get("http://127.0.0.1:8000/api/events/", {
//             headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
//         }).then(response => {
//             setEvents(response.data);
//         }).catch(error => {
//             console.error("Error fetching events:", error);
//         });
//     }, []);

//     // Logout Function
//     function handleLogout() {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         navigate("/login");
//     }

//     return (
//         <div className="w-full min-h-screen bg-gray-900 text-white p-5">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//                 <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
//             </div>

//             {/* Event Management */}
//             <div className="mb-6">
//                 <h2 className="text-2xl font-semibold">Manage Events</h2>
//                 <ul className="mt-3">
//                     {events.map(event => (
//                         <li key={event.E_ID} className="bg-gray-800 p-3 my-2 rounded flex justify-between">
//                             <span>{event.E_Name} ({event.E_Start_Date})</span>
//                             <button className="bg-red-500 px-3 py-1 rounded">Delete</button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Volunteer Management */}
//             <div>
//                 <h2 className="text-2xl font-semibold">Manage Volunteers</h2>
//                 <ul className="mt-3">
//                     {volunteers.map(volunteer => (
//                         <li key={volunteer.id} className="bg-gray-800 p-3 my-2 rounded flex justify-between">
//                             <span>{volunteer.name} ({volunteer.email})</span>
//                             <button className="bg-red-500 px-3 py-1 rounded">Remove</button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

// export default AdminDashboard;



import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import CreateVolunteer from "../components/volunteers/CreateVolunteer";
import DeleteVolunteer from "../components/volunteers/DeleteVolunteer";
import UpdateVolunteer from "../components/volunteers/UpdateVolunteer";
import ViewAll from "../components/volunteers/ViewAll";
import CreateEvent from "../components/events/CreateEvent";
import ViewEvents from "../components/events/ViewEvents";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* ✅ Navbar */}
      <div className="w-full bg-gray-800 py-4 shadow-md">
        <h1 className="text-center text-3xl font-bold text-white">Admin Dashboard</h1>
      </div>

      {/* ✅ Buttons Section */}
      <div className="w-full flex justify-center gap-4 mt-6">
        <button className="bg-green-500 px-6 py-2 rounded text-white font-bold"
          onClick={() => navigate("/admin/create-volunteer")}>
          Add Volunteer
        </button>
        <button className="bg-blue-500 px-6 py-2 rounded text-white font-bold"
          onClick={() => navigate("/admin/view-all")}>
          View Volunteers
        </button>
        <button className="bg-purple-500 px-6 py-2 rounded text-white font-bold"
          onClick={() => navigate("/admin/create-event")}>
          Add Event
        </button>
        <button className="bg-yellow-500 px-6 py-2 rounded text-black font-bold"
          onClick={() => navigate("/admin/view-events")}>
          View Events
        </button>
      </div>

      {/* ✅ Routes for Admin Actions */}
      <div className="mt-6 p-4">
        <Routes>
          <Route path="create-volunteer" element={<CreateVolunteer />} />
          <Route path="delete-volunteer" element={<DeleteVolunteer />} />
          <Route path="update-volunteer" element={<UpdateVolunteer />} />
          <Route path="view-all" element={<ViewAll />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="view-events" element={<ViewEvents />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
