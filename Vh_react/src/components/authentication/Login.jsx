// import React from "react";
// import {useState,useEffect} from "react";

// function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [passwordError, setPasswordError] = useState("");

//     function handleEmail(e){
//         setEmail(e.target.value);
//     }
//     function handlePassword(e){
//         let pass = e.target.value
//         setPassword(e.target.value);
        
//         if(pass.length < 8){
//             setPasswordError("Password must be at least 8 characters long");
//         }
//         if(pass.length >= 8){
//             setPasswordError(null);
//         }
        
//     }



//     return <div className="w-full h-[100vh]  border-red-400 flex flex-col justify-center gap-5 items-center bg-[#1a202c]">
//         <h1 className="text-5xl font-bold text-white">Login</h1>
//         <div className=" h-[50%] w-[30%] flex flex-col items-center justify-around text-white">
//             <div className="w-full h-[15%]">
//                 <input type="email" placeholder="Email" value={email} className="w-full h-full px-3 rounded-md bg-[#2d3748] text-xl"
//                 onChange={handleEmail}/>
//             </div>
//             <div className="w-full h-[15%]">
//                 <input type="password" placeholder="Password" value={password} onChange={handlePassword} className="w-full h-full px-3 rounded-md bg-[#2d3748] text-xl"/>
//                 {passwordError && <p className="text-red-500 text-center py-2">{passwordError}</p>}
//             </div>            
//             <button className="bg-[#22c55e] font-bold text-xl px-3 py-1 rounded-md h-[15%] w-[40%]"
//             disabled={passwordError}>Login</button>

//             <div className=""> 
//                 <span className="text-white">Don't have an account? </span>
//                 <a href="/register" className="text-[#60a5fa]">create account</a>
//             </div>
//         </div>
//     </div>;
// }

// export default Login;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    function handleEmail(e) {
        setEmail(e.target.value);
    }

    function handlePassword(e) {
        let pass = e.target.value;
        setPassword(pass);
        setPasswordError(pass.length < 8 ? "Password must be at least 8 characters long" : "");
    }

    async function handleLogin() {
        if (passwordError) return;

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", { email, password });
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            alert("Login successful!");
            navigate("/Home");  // ✅ Redirect to Admin Dashboard
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Login failed. Check your credentials.");
        }
    }

    return (
        <div className="w-full h-[100vh] flex flex-col justify-center gap-5 items-center bg-[#1a202c]">
            <h1 className="text-5xl font-bold text-white">Login</h1>
            <div className="h-[50%] w-[30%] flex flex-col items-center justify-around text-white">
                <input type="email" placeholder="Email" value={email}
                    className="w-full h-[15%] px-3 rounded-md bg-[#2d3748] text-xl"
                    onChange={handleEmail} />
                <input type="password" placeholder="Password" value={password}
                    className="w-full h-[15%] px-3 rounded-md bg-[#2d3748] text-xl"
                    onChange={handlePassword} />
                {passwordError && <p className="text-red-500 text-center py-2">{passwordError}</p>}
                {errorMessage && <p className="text-red-500 text-center py-2">{errorMessage}</p>}

                <button className="bg-[#22c55e] font-bold text-xl px-3 py-2 rounded-md h-[15%] w-[40%]"
                    disabled={passwordError}
                    onClick={handleLogin}>Login</button>

                <div>
                    <span className="text-white">Don't have an account? </span>
                    <a href="/signup" className="text-[#60a5fa]">Create account</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
