import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Volunteer");
    const [college, setCollege] = useState("");
    const [faculty, setFaculty] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const navigate = useNavigate();

    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    function handleSignupChange(e) {
        const { name, value } = e.target;

        switch (name) {
            case "name":
                setName(value);
                break;
            case "email":
                setEmail(value);
                setEmailError(validateEmail(value) ? "" : "Invalid email format");
                break;
            case "phone":
                setPhone(value);
                break;
            case "password":
                setPassword(value);
                setPasswordError(validatePassword(value)
                    ? ""
                    : "Password must have 8+ characters, 1 uppercase, 1 lowercase, 1 number & 1 special character."
                );
                setConfirmPasswordError(confirmPassword && value !== confirmPassword ? "Passwords do not match" : "");
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                setConfirmPasswordError(value !== password ? "Passwords do not match" : "");
                break;
            case "college":
                setCollege(value);
                break;
            case "faculty":
                setFaculty(value);
                break;
            case "year":
                setYear(value);
                break;
            case "role":
                setRole(value);
                break;
            default:
                break;
        }
    }

    async function handleSignup() {
        if (!name || !email || !phone || !password || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return;
        }
        if (!validateEmail(email)) {
            setErrorMessage("Invalid email format.");
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage("Password must have at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
    
        setLoading(true);
        setErrorMessage("");
    
        try {
            await axios.post("http://127.0.0.1:8000/api/auth/signup/", {
                name,
                email,
                phone,
                password,
                role,  
                college_name: college || "",  
                faculty: faculty || "",
                year_of_study: year || null,
            }, {
                headers: { "Content-Type": "application/json" }
            });
    
            Swal.fire({
                icon: "success",
                title: "Signup Successful!",
                text: "Redirecting to login...",
                showConfirmButton: false,
                timer: 2000 
            });
    
            setTimeout(() => navigate("/login"), 2000);
    
        } catch (error) {
            console.log("❌ Signup Error:", error.response?.data);
            
            if (error.response?.data?.email) {
                setErrorMessage("❌ Email is already registered! Try a different one.");
            } else {
                setErrorMessage(error.response?.data?.error || "Signup failed! Try again.");
            }
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
            <h1 className="text-4xl font-bold text-white mb-5">Create Account</h1>
            <div className="w-[35%] flex flex-col items-center text-white bg-[#2d3748] p-6 rounded-lg shadow-md">
                
                <input type="text" name="name" placeholder="Full Name" value={name}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none"
                    onChange={handleSignupChange} />

                <input type="email" name="email" placeholder="Email" value={email}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                    onChange={handleSignupChange} />
                {emailError && <p className="text-red-500 text-center py-2">{emailError}</p>}

                <input type="text" name="phone" placeholder="Phone Number" value={phone}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                    onChange={handleSignupChange} />

                <input type="password" name="password" placeholder="Password" value={password}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                    onChange={handleSignupChange} />
                {passwordError && <p className="text-red-500 text-center py-2">{passwordError}</p>}

                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                    onChange={handleSignupChange} />
                {confirmPasswordError && <p className="text-red-500 text-center py-2">{confirmPasswordError}</p>}

                <select name="role" value={role} onChange={handleSignupChange}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3">
                    <option value="Volunteer">Volunteer</option>
                    <option value="Event Organizer">Event Organizer</option>
                    <option value="Admin">Admin</option>
                </select>

                <input type="text" name="college" placeholder="College Name (Optional)" value={college}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                    onChange={handleSignupChange} />

                <input type="text" name="faculty" placeholder="Faculty (Optional)" value={faculty}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                    onChange={handleSignupChange} />

                {errorMessage && <p className="text-red-500 text-center py-2">{errorMessage}</p>}

                <button className="bg-[#22c55e] font-bold text-lg px-5 py-2 rounded-md mt-4 w-full"
                    disabled={loading}
                    onClick={handleSignup}>
                    {loading ? "Creating Account..." : "Signup"}
                </button>
            </div>
        </div>
    );
}

export default Signup;
