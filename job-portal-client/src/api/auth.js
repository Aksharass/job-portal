import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authAPI = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: { "Content-Type": "application/json" },
});

export const registerUser = async (userData) => {
  const res = await authAPI.post("/register", userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await authAPI.post("/login", credentials);
  return res.data;
};
