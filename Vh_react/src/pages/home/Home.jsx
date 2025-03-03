// import React from "react";
// import { FaHome, FaUserFriends, FaInfoCircle, FaEnvelope, FaSignInAlt, FaClipboardList, FaUsers } from "react-icons/fa";

// function Home() {
//     return (
//         <div className="w-full min-h-screen flex bg-[#1a202c] text-white">
//             {/* Sidebar */}
//             <div className="w-1/4 min-h-screen bg-[#2d3748] flex flex-col justify-between p-6 shadow-lg">
//                 <div className="flex items-center space-x-3 text-2xl font-bold">
//                     <FaHome size={24} />
//                     <span>Home</span>
//                 </div>
//                 <h1 className="text-3xl font-bold text-center mt-20">Volunteer Management System</h1>
//                 <button className="bg-[#22c55e] text-white font-bold text-xl px-6 py-3 rounded-md w-full hover:bg-[#1f9d4d] transition-all">
//                     Apply Now
//                 </button>
//             </div>

//             {/* Main Content */}
//             <div className="w-3/4 flex flex-col">
//                 {/* Navbar */}
//                 <nav className="w-full bg-[#1a202c] p-4 flex justify-between items-center shadow-md px-10">
//                     <div className="text-xl font-bold">VMS</div>
//                     <div className="flex space-x-6">
//                         <span className="text-lg flex items-center space-x-2 hover:text-[#60a5fa] transition-all cursor-pointer">
//                             <FaInfoCircle /> <span>About Us</span>
//                         </span>
//                         <span className="text-lg flex items-center space-x-2 hover:text-[#60a5fa] transition-all cursor-pointer">
//                             <FaEnvelope /> <span>Contact</span>
//                         </span>
//                         <span className="text-lg flex items-center space-x-2 bg-[#22c55e] px-4 py-2 rounded-md hover:bg-[#1f9d4d] transition-all cursor-pointer">
//                             <FaSignInAlt /> <span>Login</span>
//                         </span>
//                     </div>
//                 </nav>
                
//                 {/* Middle Bar */}
//                 <div className="w-full bg-[#2d3748] p-6 flex justify-around items-center shadow-md ">
//                     <div className="flex items-center space-x-3">
//                         <FaClipboardList size={30} />
//                         <span className="text-lg font-semibold">Manage Volunteers</span>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                         <FaUsers size={30} />
//                         <span className="text-lg font-semibold">Community Engagement</span>
//                     </div>
//                 </div>

//                 {/* Content Section with Image and Features */}
//                 <div className="flex-grow flex flex-col items-center justify-center p-6">
//                     <img src="https://img.freepik.com/free-vector/people-volunteering-donating-money_53876-66112.jpg?semt=ais_hybrid" alt="Volunteering" className="max-w-full h-auto rounded-lg shadow-lg mb-6" />
//                     <div className="text-center max-w-2xl">
//                         <h2 className="text-4xl font-bold">Join Our Volunteer Community</h2>
//                         <p className="text-lg mt-4">Be part of something meaningful. Register, manage events, and contribute to a better world!</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Home;


import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserFriends, FaInfoCircle, FaEnvelope, FaSignInAlt, FaClipboardList, FaUsers } from "react-icons/fa";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen flex bg-[#1a202c] text-white">
            {/* Sidebar */}
            <div className="w-1/4 min-h-screen bg-[#2d3748] flex flex-col justify-between p-6 shadow-lg">
                <div className="flex items-center space-x-3 text-2xl font-bold">
                    <FaHome size={24} />
                    <span>Home</span>
                </div>
                <h1 className="text-3xl font-bold text-center mt-20">Volunteer Management System</h1>
                <button
                    onClick={() => navigate("/signup")}  // ✅ Navigate to Signup
                    className="bg-[#22c55e] text-white font-bold text-xl px-6 py-3 rounded-md w-full hover:bg-[#1f9d4d] transition-all"
                >
                    Apply Now
                </button>
            </div>

            {/* Main Content */}
            <div className="w-3/4 flex flex-col">
                {/* Navbar */}
                <nav className="w-full bg-[#1a202c] p-4 flex justify-between items-center shadow-md px-10">
                    <div className="text-xl font-bold">VMS</div>
                    <div className="flex space-x-6">
                        <span className="text-lg flex items-center space-x-2 hover:text-[#60a5fa] transition-all cursor-pointer">
                            <FaInfoCircle /> <span>About Us</span>
                        </span>
                        <span className="text-lg flex items-center space-x-2 hover:text-[#60a5fa] transition-all cursor-pointer">
                            <FaEnvelope /> <span>Contact</span>
                        </span>
                        <span
                            onClick={() => navigate("/login")}  // ✅ Navigate to Login
                            className="text-lg flex items-center space-x-2 bg-[#22c55e] px-4 py-2 rounded-md hover:bg-[#1f9d4d] transition-all cursor-pointer"
                        >
                            <FaSignInAlt /> <span>Login</span>
                        </span>
                    </div>
                </nav>
                
                {/* Middle Bar */}
                <div className="w-full bg-[#2d3748] p-6 flex justify-around items-center shadow-md ">
                    <div className="flex items-center space-x-3">
                        <FaClipboardList size={30} />
                        <span className="text-lg font-semibold">Manage Volunteers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FaUsers size={30} />
                        <span className="text-lg font-semibold">Community Engagement</span>
                    </div>
                </div>

                {/* Content Section with Image and Features */}
                <div className="flex-grow flex flex-col items-center justify-center p-6">
                    <img src="https://img.freepik.com/free-vector/people-volunteering-donating-money_53876-66112.jpg?semt=ais_hybrid" alt="Volunteering" className="max-w-full h-auto rounded-lg shadow-lg mb-6" />
                    <div className="text-center max-w-2xl">
                        <h2 className="text-4xl font-bold">Join Our Volunteer Community</h2>
                        <p className="text-lg mt-4">Be part of something meaningful. Register, manage events, and contribute to a better world!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
