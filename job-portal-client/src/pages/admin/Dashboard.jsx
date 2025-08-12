import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ManageJobs from "./ManageJobs"; // Make sure this path is correct

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "jobs", "manage"

  useEffect(() => {
    if (activeTab === "jobs" || activeTab === "manage") {
      const fetchJobs = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/api/jobs");
          setJobs(response.data.jobs || []);
        } catch {
          toast.error("Failed to fetch jobs");
        } finally {
          setLoading(false);
        }
      };
      fetchJobs();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-300 to-green-700 px-2 py-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-md p-4 sm:p-8 flex flex-col md:flex-row gap-8">
        {/* Left: Navigation/Buttons */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-4 text-green-900">Admin Actions</h2>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-3 rounded-md text-center font-semibold transition ${
              activeTab === "dashboard"
                ? "bg-green-700 text-white"
                : "bg-black text-white hover:bg-gray-700"
            }`}
          >
            Dashboard Home
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-3 rounded-md text-center font-semibold transition ${
              activeTab === "jobs"
                ? "bg-green-700 text-white"
                : "bg-black text-white hover:bg-gray-700"
            }`}
          >
            View All Job Postings
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-3 rounded-md text-center font-semibold transition ${
              activeTab === "manage"
                ? "bg-green-700 text-white"
                : "bg-black text-white hover:bg-gray-700"
            }`}
          >
            Manage Jobs
          </button>
        </div>
        {/* Right: Content */}
        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-md p-4 md:p-8 h-full flex flex-col justify-center shadow-inner border border-green-200">
            {activeTab === "dashboard" && (
              <>
                <h1 className="text-3xl font-bold mb-4 text-green-900">Admin Dashboard</h1>
                <p className="mb-6 text-gray-700">
                  Welcome to the admin dashboard. Here you can monitor platform activities.
                </p>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-green-800">Total Jobs Posted</h3>
                  <div className="text-4xl font-bold text-black">{jobs.length}</div>
                </div>
              </>
            )}
            {activeTab === "jobs" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-green-900">All Job Postings</h1>
                  <button
                    onClick={() => setActiveTab("manage")}
                    className="bg-black text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition text-sm"
                  >
                    Go to Manage Jobs
                  </button>
                </div>
                {loading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : jobs.length === 0 ? (
                  <div className="text-gray-500">No jobs found.</div>
                ) : (
                  <ul className="divide-y divide-green-200">
                    {jobs.map((job) => (
                      <li key={job._id} className="py-3">
                        <div className="font-semibold text-green-800">{job.title}</div>
                        <div className="text-sm text-gray-600">{job.company}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {activeTab === "manage" && <ManageJobs />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
