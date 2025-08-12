import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
const API_BASE = import.meta.env.VITE_API_URL;

const ApplyJob = () => {
  const { jobId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    resumeLink: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
       `${API_BASE}/jobs/${jobId}/apply`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Application submitted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow bg-opacity-10 ">
      <h2 className="text-2xl font-bold mb-6">Apply for Job ID: {jobId}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="w-full border p-3 rounded"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="resumeLink"
          placeholder="Resume URL"
          className="w-full border p-3 rounded"
          value={form.resumeLink}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;
