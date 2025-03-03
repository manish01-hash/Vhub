import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import CreateVolunteer from "../components/volunteers/CreateVolunteer";
import DeleteVolunteer from "../components/volunteers/DeleteVolunteer";
import UpdateVolunteer from "../components/volunteers/UpdateVolunteer";
import ViewAll from "../components/volunteers/ViewAll";
import CreateEvent from "../components/events/CreateEvent";
import ViewEvents from "../components/events/ViewEvents";

function AdminDashboard() {
  const navigate = useNavigate(); // ✅ Use navigate for proper routing

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col bg-gray-900">
      {/* Navbar */}
      <div className="navbar w-full h-[20%] flex flex-col justify-around gap-4 items-center bg-gray-700">
        <div className="w-full h-[50%] flex justify-center gap-4 items-center bg-gray-700">
          <button
            className="w-[10%] bg-green-500 h-[80%] rounded-md text-xl font-bold"
            onClick={() => navigate("/admin/create-volunteer")} // ✅ Fix: Reset path
          >
            Add Volunteer
          </button>
          <button
            className="w-[10%] bg-blue-400 h-[80%] rounded-md text-xl font-bold"
            onClick={() => navigate("/admin/view-all")} // ✅ Fix: Reset path
          >
            View Volunteers
          </button>
          <button
            className="w-[10%] bg-purple-400 h-[80%] rounded-md text-xl font-bold"
            onClick={() => navigate("/admin/create-event")} // ✅ Fix: Reset path
          >
            Add Event
          </button>
          <button
            className="w-[10%] bg-yellow-400 h-[80%] rounded-md text-xl font-bold"
            onClick={() => navigate("/admin/view-events")} // ✅ Fix: Reset path
          >
            View Events
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[80%] w-full">
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
