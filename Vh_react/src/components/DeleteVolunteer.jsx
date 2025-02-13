import React, { useState } from "react";

import axios from "axios";



function DeleteVolunteer() {
    
    const [phoneNo, setPhoneNo] = useState("");
    const [message,setMessage] = useState("")
    



    function handleSubmit(){
        setMessage("");  
    
        console.log("Sending phone no:", phoneNo); // ✅ Debugging Step
    
        axios.delete(`http://127.0.0.1:8000/api/volunteers/delete/by-phone/${phoneNo}/`)
    .then(response => setMessage("Deleted Successfully"))
    .catch(error => setMessage("Volunteer Not Found!..."));

    }
    

    return (
        <div className=" h-[60%] relative flex flex-col items-center 	bg-gray-900">
            <h1 className="text-center text-5xl font-bold mt-10 text-white">Delete Volunteer</h1>

            <div className="flex flex-col  items-center h-[60vh] w-[30vw] mx-auto my-[100px]">
               <div className="flex flex-col items-center">
               <label htmlFor="" className="text-2xl py-10 text-white">Enter the phone number to delete Volunteer</label>
               <input type="text" className="text-xl font-bold"placeholder="Phone Number" onChange={(e) => setPhoneNo(e.target.value)} />
               </div>

                <button className="bg-red-400 mt-3 text-white py-5 px-10 text-2xl font-bold mt-10 rounded-xl "
                onClick={handleSubmit}>Delete</button>
                
            </div>

            {message && <p className="text-center text-xl mt-4 absolute bottom-5 text-xl font-bold text-red-800">{message}</p>}
        </div>
    );
}

export default DeleteVolunteer;