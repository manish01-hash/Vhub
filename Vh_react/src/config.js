import dotenv from "dotenv";
dotenv.config();

const API_BASE_URL = process.env.VITE_API_BASE_URL || "https://vhub-zb2y.onrender.com";
export default API_BASE_URL;
