import React, { useState, useEffect, useRef } from "react";  // ✅ Import useRef
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Volunteer");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const isMounted = useRef(false);  // ✅ Track first render

    async function handleLogin(e) {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage("All fields are required.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
                email,
                password,
                role,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 200) {
                console.log("✅ Login Success:", response.data);

                // Debug: Check LocalStorage Updates
                console.log("🔍 Before setting role:", localStorage.getItem("userRole"));
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
                localStorage.setItem("userRole", response.data.role);
                console.log("✅ After setting role:", localStorage.getItem("userRole"));

                // ✅ Redirect based on role
                setTimeout(() => {
                    console.log("🚀 Redirecting after delay...");

                    if (response.data.role === "Admin") {
                        console.log("🔵 Navigating to /admin-dashboard");
                        navigate("/admin-dashboard", { replace: true });
                    } else {
                        console.log("🟢 Navigating to /volunteer-dashboard");
                        navigate("/volunteer-dashboard", { replace: true });
                    }
                }, 200);
            } else {
                setErrorMessage("Invalid credentials! Please try again.");
            }
        } catch (error) {
            console.error("❌ Login Error:", error.response);
            setErrorMessage(error.response?.data?.error || "Invalid credentials! Please try again.");
        } finally {
            setLoading(false);
        }
    }

    // ✅ Prevent Infinite Loop - Ensures useEffect runs only once
    useEffect(() => {
        if (isMounted.current) return;  // ✅ Prevents multiple executions

        console.log("⚡ Checking userRole on first mount...");
        const userRole = localStorage.getItem("userRole");
        console.log("🔍 Stored userRole:", userRole);

        if (userRole && window.location.pathname === "/") {
            console.log("🔁 Redirecting due to existing session...");
            setTimeout(() => {
                if (userRole === "Admin") {
                    console.log("🔵 Navigating to /admin-dashboard");
                    navigate("/admin-dashboard", { replace: true });
                } else {
                    console.log("🟢 Navigating to /volunteer-dashboard");
                    navigate("/volunteer-dashboard", { replace: true });
                }
            }, 200);
        }

        isMounted.current = true;  // ✅ Marks that useEffect has run
    }, [navigate]);  // ✅ Now runs only **once**

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
            <h1 className="text-5xl font-bold text-white mb-5">Login</h1>
            <div className="w-[30%] flex flex-col items-center justify-around text-white bg-[#2d3748] p-6 rounded-lg shadow-md">
                <form className="w-full flex flex-col" onSubmit={handleLogin}>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder="Email" 
                        value={email}
                        className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none"
                        onChange={(e) => setEmail(e.target.value.trim())} 
                        required 
                    />

                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder="Password" 
                        value={password}
                        className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                        onChange={(e) => setPassword(e.target.value.trim())} 
                        required 
                    />

                    <label htmlFor="role">Select Role:</label>
                    <select 
                        id="role" 
                        name="role"
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-2"
                        required
                    >
                        <option value="Volunteer">Volunteer</option>
                        <option value="Admin">Admin</option>
                    </select>

                    {errorMessage && <p className="text-red-500 text-center py-2">{errorMessage}</p>}

                    <button 
                        type="submit"
                        className="bg-[#22c55e] font-bold text-lg px-5 py-2 rounded-md mt-4 w-full"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4">
                    <span className="text-white">Don't have an account? </span>
                    <a href="/signup" className="text-[#60a5fa]">Create account</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
