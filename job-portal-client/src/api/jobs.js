import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const jobsAPI = axios.create({
  baseURL: `${API_URL}`, // Updated to match backend route
  headers: { "Content-Type": "application/json" },
});

// Add a cache-busting timestamp to API requests
export const fetchJobs = async (params) => {
  const timestamp = new Date().getTime(); // Cache-busting timestamp
  const url = "/search";
  const res = await jobsAPI.get(url, { params: { ...params, _t: timestamp } });
  return res.data;
};

export const postJob = async (jobData, token) => {
  const res = await jobsAPI.post("/", jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateJob = async (jobId, jobData, token) => {
  const res = await jobsAPI.put(`/${jobId}`, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteJob = async (jobId, token) => {
  const res = await jobsAPI.delete(`/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
