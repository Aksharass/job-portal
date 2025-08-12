import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const userAPI = axios.create({
  baseURL: `${API_URL}/users`,
  headers: { "Content-Type": "application/json" },
});

export const fetchUserProfile = async (token) => {
  const res = await userAPI.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUserProfile = async (profileData, token) => {
  const res = await userAPI.put("/profile", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
