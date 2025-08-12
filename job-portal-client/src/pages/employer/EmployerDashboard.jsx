import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ErrorBoundary from "../../components/ErrorBoundary";
import PostJob from "./PostJob";
import { toast } from "react-toastify";
import ViewApplicants from "./ViewApplicants"; // Import the ViewApplicants component
import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("postJob");
  const [jobToEdit, setJobToEdit] = useState(null);

  // For applicants view
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employer/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJobs(response.data.jobs);
      } catch (error) {
        toast.error("Failed to fetch jobs", { error });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/employer/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Job deleted successfully");
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const handleJobAdded = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
    toast.success("Job posted successfully!");
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
    );
    toast.success("Job updated successfully!");
  };

  const handleEdit = (job) => {
    setView("postJob");
    setJobToEdit(job);
  };

  // Fetch applicants for a job
  const handleViewApplicants = async (jobId) => {
    setApplicantsLoading(true);
    setSelectedJob(jobId);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/employer/jobs/${jobId}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplicants(response.data.applicants || []);
      setView("viewApplicants");
    } catch {
      toast.error("Failed to fetch applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-white-300 to-green-700">
      <div className="w-full max-w-5xl mx-auto px-2 py-6">
        <h1 className="text-3xl font-bold mb-6 text-left">Employer Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column: Buttons */}
          <div className="md:w-1/3 w-full flex flex-col gap-4 md:items-start items-stretch">
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => {
                  setView("postJob");
                  setJobToEdit(null);
                }}
                className={`w-full px-4 py-2 rounded font-semibold transition-colors duration-200 ${
                  view === "postJob"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-300"
                }`}
              >
                Post a Job
              </button>
              <button
                onClick={() => setView("viewApplications")}
                className={`w-full px-4 py-2 rounded font-semibold transition-colors duration-200 ${
                  view === "viewApplications"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-300"
                }`}
              >
                View Job Applications
              </button>
              <button
                onClick={() => setView("viewApplicantsList")}
                className={`w-full px-4 py-2 rounded font-semibold transition-colors duration-200 ${
                  view === "viewApplicantsList"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-300"
                }`}
              >
                View Applicants
              </button>
            </div>
          </div>
          {/* Right column: Content */}
          <div className="md:w-2/3 w-full">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4">
              {view === "postJob" ? (
                <PostJob
                  jobToEdit={jobToEdit}
                  onJobAdded={handleJobAdded}
                  onJobUpdated={handleJobUpdated}
                />
              ) : view === "viewApplicants" && selectedJob ? (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-green-900">
                    Applicants
                  </h2>
                  {applicantsLoading ? (
                    <p className="text-center">Loading applicants...</p>
                  ) : applicants.length === 0 ? (
                    <p className="text-center">No applicants for this job.</p>
                  ) : (
                    <ul className="divide-y divide-green-200">
                      {applicants.map((applicant) => (
                        <li key={applicant._id} className="py-2">
                          <div className="font-semibold">{applicant.username}</div>
                          <div className="text-sm text-gray-600">
                            {applicant.email}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="mt-6 w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => setView("viewApplicantsList")}
                  >
                    Back
                  </button>
                </div>
              ) : view === "viewApplicantsList" ? (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-green-900">
                    Select a Job to View Applicants
                  </h2>
                  {loading ? (
                    <p className="text-center">Loading jobs...</p>
                  ) : Array.isArray(jobs) && jobs.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {jobs.map((job) => (
                        <li
                          key={job._id}
                          className="py-3 flex justify-between items-center"
                        >
                          <span className="font-semibold">{job.title}</span>
                          <button
                            onClick={() => handleViewApplicants(job._id)}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
                          >
                            View Applicants
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center">No jobs available</p>
                  )}
                </div>
              ) : (
                <div>
                  {loading ? (
                    <p className="text-center">Loading jobs...</p>
                  ) : Array.isArray(jobs) && jobs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="p-2 text-left">Title</th>
                            <th className="p-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs.map((job) => (
                            <tr key={job._id} className="border-b border-gray-300">
                              <td className="p-2">{job.title}</td>
                              <td className="p-2 space-x-2">
                                <button
                                  onClick={() => handleDelete(job._id)}
                                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 mb-2 mr-2"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleEdit(job)}
                                  className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200 ml-2"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center">No jobs available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployerDashboardWithErrorBoundary = () => (
  <ErrorBoundary>
    <EmployerDashboard />
  </ErrorBoundary>
);

export default EmployerDashboardWithErrorBoundary;
