import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { isValidPhoneNumber } from "libphonenumber-js";
import countries from "./countries.json";
import API_BASE_URL from "../../config";

function Signup() {
    // State management
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        countryCode: "+91",
        password: "",
        confirmPassword: "",
        role: "Volunteer",
        gender: "",
        college: "",
        faculty: "",
        year: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Memoize country list to prevent unnecessary re-renders
    const memoizedCountries = useMemo(() => countries, []);

    // Check authentication status
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsLoggedIn(true);
        }
    }, []);

    // Validation functions
    const validate = {
        email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        password: (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password),
        phone: (phone, countryCode) => {
            try {
                return isValidPhoneNumber(`${countryCode}${phone}`);
            } catch {
                return false;
            }
        }
    };

    // Handle input changes with validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        if (name === "email") {
            setErrors(prev => ({
                ...prev,
                email: !validate.email(value) ? "Invalid email format" : ""
            }));
        } else if (name === "password") {
            setErrors(prev => ({
                ...prev,
                password: !validate.password(value)
                    ? "Must include uppercase, lowercase, number, and special character"
                    : "",
                confirmPassword: formData.confirmPassword && value !== formData.confirmPassword
                    ? "Passwords don't match"
                    : ""
            }));
        } else if (name === "confirmPassword") {
            setErrors(prev => ({
                ...prev,
                confirmPassword: value !== formData.password
                    ? "Passwords don't match"
                    : ""
            }));
        } else if (name === "phone" || name === "countryCode") {
            const phone = name === "phone" ? value : formData.phone;
            const code = name === "countryCode" ? value : formData.countryCode;
            setErrors(prev => ({
                ...prev,
                phone: !validate.phone(phone, code) ? "Invalid phone number" : ""
            }));
        }
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const newErrors = {
            name: !formData.name ? "Name is required" : "",
            email: !formData.email ? "Email is required" 
                 : !validate.email(formData.email) ? "Invalid email" : "",
            phone: !formData.phone ? "Phone is required" 
                 : !validate.phone(formData.phone, formData.countryCode) ? "Invalid phone" : "",
            password: !formData.password ? "Password is required" 
                     : !validate.password(formData.password) ? "Doesn't meet requirements" : "",
            confirmPassword: formData.password !== formData.confirmPassword ? "Passwords don't match" : "",
            gender: !formData.gender ? "Gender is required" : "",
            role: !formData.role ? "Role is required" : ""
        };

        setErrors(newErrors);

        // Check if any errors exist
        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        setLoading(true);

        try {
            // Format phone number
            const formattedPhone = formData.phone.startsWith(formData.countryCode) 
                ? formData.phone 
                : `${formData.countryCode}${formData.phone.replace(/^\+/, '')}`;

            // API request
            await axios.post(`${API_BASE_URL}/api/auth/signup/`, {
                name: formData.name,
                email: formData.email,
                phone: formattedPhone,
                password: formData.password,
                role: formData.role,
                gender: formData.gender,
                college_name: formData.college || "",
                faculty: formData.faculty || "",
                year_of_study: formData.year || null
            }, {
                headers: { "Content-Type": "application/json" },
                timeout: 10000
            });

            // Success handling
            Swal.fire({
                icon: "success",
                title: "Account Created!",
                text: "Redirecting to login...",
                timer: 2000,
                showConfirmButton: false
            });
            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            let errorMessage = "Signup failed. Please try again.";
            
            if (error.response) {
                if (error.response.status === 400 && error.response.data.email) {
                    errorMessage = "Email already exists";
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
            } else if (error.code === "ECONNABORTED") {
                errorMessage = "Request timed out. Please try again.";
            } else if (error.message === "Network Error") {
                errorMessage = "Network error. Please check your connection.";
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    // If user is already logged in
    if (isLoggedIn) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
                <div className="w-[35%] bg-[#2d3748] p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">You're Already Logged In</h2>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-[#22c55e] text-white font-bold py-2 px-6 rounded-md hover:bg-[#1ea94d] transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Main signup form
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
            <h1 className="text-4xl font-bold text-white mb-8">Create Account</h1>
            
            <form 
                onSubmit={handleSubmit}
                className="w-[35%] flex flex-col items-center text-white bg-[#2d3748] p-8 rounded-lg shadow-md space-y-4"
                noValidate
            >
                {/* Name */}
                <div className="w-full">
                    <label htmlFor="name" className="block mb-1 text-sm font-medium">Full Name*</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="w-full">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium">Email*</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="w-full">
                    <label htmlFor="phone" className="block mb-1 text-sm font-medium">Phone Number*</label>
                    <div className="flex gap-2">
                        <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="w-1/4 h-12 px-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        >
                            {memoizedCountries.map(country => (
                                <option key={country.code} value={country.dial_code}>
                                    {country.flag} {country.dial_code}
                                </option>
                            ))}
                        </select>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-3/4 h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                            required
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div className="w-full">
                    <label htmlFor="password" className="block mb-1 text-sm font-medium">Password*</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        required
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                    {formData.password && !errors.password && (
                        <div className="text-xs mt-1 text-green-500">
                            ✓ Meets requirements
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="w-full">
                    <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">Confirm Password*</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        required
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Gender */}
                <div className="w-full">
                    <label className="block mb-1 text-sm font-medium">Gender*</label>
                    <div className="flex gap-2">
                        {["Male", "Female", "Other"].map(genderOption => (
                            <button
                                key={genderOption}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, gender: genderOption }))}
                                className={`flex-1 h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] ${
                                    formData.gender === genderOption 
                                        ? "bg-[#22c55e] text-white" 
                                        : "bg-gray-700"
                                }`}
                            >
                                {genderOption}
                            </button>
                        ))}
                    </div>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>

                {/* College Info */}
                <div className="w-full space-y-4">
                    <div>
                        <label htmlFor="college" className="block mb-1 text-sm font-medium">College Name</label>
                        <input
                            id="college"
                            name="college"
                            type="text"
                            value={formData.college}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        />
                    </div>

                    <div>
                        <label htmlFor="faculty" className="block mb-1 text-sm font-medium">Faculty</label>
                        <input
                            id="faculty"
                            name="faculty"
                            type="text"
                            value={formData.faculty}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        />
                    </div>

                    <div>
                        <label htmlFor="year" className="block mb-1 text-sm font-medium">Year of Study</label>
                        <input
                            id="year"
                            name="year"
                            type="text"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        />
                    </div>
                </div>

                {/* Role */}
                <div className="w-full">
                    <label htmlFor="role" className="block mb-1 text-sm font-medium">Role*</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                        required
                    >
                        <option value="Volunteer">Volunteer</option>
                        <option value="Event Organizer">Event Organizer</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 bg-[#22c55e] font-bold rounded-md mt-4 ${
                        loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#1ea94d]"
                    }`}
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-blue-400 hover:underline focus:outline-none"
                    >
                        Log In
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Signup;