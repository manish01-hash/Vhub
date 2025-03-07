// import React, { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [eventId, setEventId] = useState(null);
//     const navigate = useNavigate();

//     // Load user from localStorage on app start
//     useEffect(() => {
//         const accessToken = localStorage.getItem("accessToken");
//         const storedUser = localStorage.getItem("user");

//         if (accessToken && storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//         setLoading(false);
//     }, []);

    

//     // Login function
//     const login = async (email, password) => {
//         try {
//             const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", { email, password }, {
//                 headers: { "Content-Type": "application/json" }
//             });

//             localStorage.setItem("accessToken", response.data.access);
//             localStorage.setItem("refreshToken", response.data.refresh);
//             localStorage.setItem("user", JSON.stringify(response.data.user));

//             setUser(response.data.user);
//             return { success: true };
//         } catch (error) {
//             return { success: false, message: error.response?.data?.error || "Login failed!" };
//         }
//     };

//     // Logout function
//     const logout = () => {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         localStorage.removeItem("user");
//         setUser(null);
//         navigate("/login");
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => React.useContext(AuthContext);




















import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eventId, setEventId] = useState(localStorage.getItem("eventId") || null);
    const navigate = useNavigate();

    // Load user from localStorage on app start
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (accessToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // ✅ Ensure eventId is updated when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            setEventId(localStorage.getItem("eventId"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // ✅ Function to set Event ID
    const updateEventId = (id) => {
        setEventId(id);
        localStorage.setItem("eventId", id);
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", { email, password }, {
                headers: { "Content-Type": "application/json" }
            });

            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Login failed!" };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("eventId");
        setUser(null);
        setEventId(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, eventId, updateEventId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
