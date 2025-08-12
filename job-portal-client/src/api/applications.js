import axios from "axios";

export const fetchUserApplications = async (token) => {
  const response = await axios.get("http://localhost:5000/api/user/applications", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
