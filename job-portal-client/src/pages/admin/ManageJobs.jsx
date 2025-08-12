import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import.meta.env;
const ManageJobs = () => {
  const { token } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/jobs`);
        setJobs(response.data.jobs || []);
      } catch {
        toast.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const handleToggleApprove = (jobId) => {
    setJobs(jobs.map((job) =>
      job._id === jobId ? { ...job, isApproved: !job.isApproved } : job
    ));
    toast.success("Job status updated");
  };

  const handleRemove = (jobId) => {
    setJobs(jobs.filter((job) => job._id !== jobId));
    toast.success("Job removed successfully");
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-green-900 text-center md:text-left">
        Manage Jobs
      </h1>
      {loading ? (
        <div className="text-gray-500 text-center py-8">Loading jobs...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] bg-white rounded-md shadow-sm">
            <thead>
              <tr className="bg-green-100">
                <th className="p-3 text-left text-sm font-semibold text-green-900">Title</th>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-green-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-green-100 hover:bg-green-50 transition"
                >
                  <td className="p-3 text-sm">{job.title}</td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        job.isApproved
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {job.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleToggleApprove(job._id)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        job.isApproved
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {job.isApproved ? "Deactivate" : "Approve"}
                    </button>
                    {job.isApproved && (
                      <button
                        onClick={() => handleRemove(job._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-100 px-2 bg-gradient-to-br from-white-300 to-green-700">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-green-900">Job Details</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Title:</span> {selectedJob.title}
              </p>
              <p>
                <span className="font-semibold">Description:</span> {selectedJob.description}
              </p>
              <p>
                <span className="font-semibold">Company:</span> {selectedJob.companyName}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {selectedJob.location}
              </p>
              <p>
                <span className="font-semibold">Type:</span> {selectedJob.jobType}
              </p>
              <p>
                <span className="font-semibold">Salary:</span> {selectedJob.salary}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    selectedJob.isApproved
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {selectedJob.isApproved ? "Approved" : "Pending"}
                </span>
              </p>
            </div>
            <button
              className="mt-6 w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => setSelectedJob(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
