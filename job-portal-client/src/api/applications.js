import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUserApplications = async (token) => {
  const response = await axios.get(`${API_URL}/user/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
