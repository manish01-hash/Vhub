import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../../config";

function Login() {
    // State management
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "Volunteer"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const isMounted = useRef(false);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "email" ? value.trim() : value
        }));
    };

    // Handle login submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        
        // Validate inputs
        if (!formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/login/`,
                {
                    email: formData.email,
                    password: formData.password
                },
                {
                    headers: { "Content-Type": "application/json" },
                    timeout: 10000 // 10-second timeout
                }
            );

            // Verify role matches
            if (formData.role !== response.data.role) {
                Swal.fire({
                    icon: "error",
                    title: "Role Mismatch",
                    text: `Please login as ${response.data.role}`,
                    confirmButtonColor: "#22c55e"
                });
                return;
            }

            // Store tokens and role
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            localStorage.setItem("userRole", response.data.role);

            // Redirect based on role
            const redirectPath = getRedirectPath(response.data.role);
            
            await Swal.fire({
                icon: "success",
                title: "Login Successful!",
                text: `Redirecting to ${response.data.role} dashboard...`,
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true
            });

            navigate(redirectPath, { replace: true });

        } catch (err) {
            handleLoginError(err);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    // Get redirect path based on role
    const getRedirectPath = (role) => {
        switch(role) {
            case "Admin":
                return "/admin-dashboard";
            case "Event Organizer":
                return "/organizer-dashboard";
            case "Coordinator":
                return "/coordinator-dashboard";
            case "Super Volunteer":
                return "/super-volunteer-dashboard";
            default:
                return "/home";
        }
    };

    // Handle login errors
    const handleLoginError = (error) => {
        let errorMsg = "Login failed. Please try again.";
        
        if (error.response) {
            if (error.response.status === 401) {
                errorMsg = "Invalid email or password";
            } else if (error.response.data?.error) {
                errorMsg = error.response.data.error;
            }
        } else if (error.code === "ECONNABORTED") {
            errorMsg = "Request timed out. Please try again.";
        } else if (error.message === "Network Error") {
            errorMsg = "Network error. Please check your connection.";
        }

        setError(errorMsg);
    };

    // Redirect if already logged in
    useEffect(() => {
        if (isMounted.current) return;

        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("userRole");
        
        if (token && role && location.pathname === "/login") {
            navigate(getRedirectPath(role), { replace: true });
        }

        isMounted.current = true;
    }, [navigate, location]);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
            <h1 className="text-4xl font-bold text-white mb-8">Login</h1>
            
            <div className="w-full max-w-md bg-[#2d3748] p-8 rounded-xl shadow-lg border border-gray-700">
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                            Select Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        >
                            <option value="Volunteer">Volunteer</option>
                            <option value="Event Organizer">Event Organizer</option>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Super Volunteer">Super Volunteer</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-400 text-sm text-center py-2">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
                            loading ? "bg-green-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : "Login"}
                    </button>
                </form>

                {/* Signup Link */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        className="font-medium text-green-500 hover:text-green-400 hover:underline"
                    >
                        Create one
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;