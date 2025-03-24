import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/`);

        socket.onopen = () => {
            console.log("WebSocket connection established.");
        };

        socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            setNotifications((prev) => [notification, ...prev]);
            console.log("New notification:", notification);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed. Reconnecting...");
            // Implement reconnection logic if needed
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ notifications }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);