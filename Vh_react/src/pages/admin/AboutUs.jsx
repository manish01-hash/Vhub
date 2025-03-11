import React from "react";
import { FaUsers, FaUniversity, FaCode } from "react-icons/fa";
import teamLogo from "../../assets/Vcoders_logo.jpg"
import Sidebar from "./Sidebar";

const AboutUs = () => {
    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            <div className="flex-1 p-8 flex flex-col items-center">
                <div className="max-w-4xl text-center">
                    <img src={teamLogo} alt="Vcoders Logo" className="w-40 mx-auto mb-6 rounded-lg" />
                    <h1 className="text-4xl font-bold text-green-400">Vcoders</h1>
                    <p className="text-lg text-gray-300 mt-2">B.Sc. Computer Science Team</p>
                </div>

                <div className="mt-8 bg-[#2d3748] p-6 rounded-lg shadow-lg w-full max-w-3xl">
                    <h2 className="text-2xl font-bold text-yellow-400 flex items-center">
                        <FaUniversity className="mr-3" /> Vidya Pratishthan’s Arts, Commerce, and Science College of Baramati
                    </h2>
                </div>

                <div className="mt-6 bg-[#2d3748] p-6 rounded-lg shadow-lg w-full max-w-3xl">
                    <h2 className="text-2xl font-bold text-blue-400 flex items-center">
                        <FaUsers className="mr-3" /> Our Team Members
                    </h2>
                    <ul className="list-disc list-inside text-lg text-gray-300 mt-3">
                        <li>Chaitanya</li>
                        <li>Manish</li>
                        <li>Uday</li>
                        <li>Atish</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;