import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if the user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            axios.get("http://127.0.0.1:8000/api/auth/user/", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(() => {
                logout();
            });
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", { email, password });
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.detail || "Login failed" };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
