import axios from "axios";

// ✅ Correct way to access .env variable in Vite
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;
