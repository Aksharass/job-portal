import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const JobDetails = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState({ applied: false, notLoggedIn: false });
  const [loading, setLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [application, setApplication] = useState({
    cv: null,
    coverLetter: "",
  });

  useEffect(() => {
    if (!jobId) {
      toast.error("Invalid job ID");
      return;
    }

    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employer/jobs/${jobId}`
        );
        setJob((prev) => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const checkIfApplied = async (jobId, setJob) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setJob((prev) => ({ ...prev, applied: false, notLoggedIn: true }));
        return;
      }
      const response = await axios.get(
        `http://localhost:5000/api/employer/jobs/${jobId}/check-application`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJob((prev) => ({ ...prev, applied: response.data.applied, notLoggedIn: false }));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setJob((prev) => ({ ...prev, applied: false, notLoggedIn: true }));
      } else {
        console.error("Error checking application status:", error);
      }
    }
  };

  useEffect(() => {
    if (jobId) checkIfApplied(jobId, setJob);
    
  }, [jobId]);

  const handleApply = async () => {
    if (!application.cv && !application.coverLetter) {
      toast.error("Please upload a CV or provide a cover letter");
      return;
    }

    const formData = new FormData();
    if (application.cv) formData.append("cv", application.cv);
    if (application.coverLetter)
      formData.append("coverLetter", application.coverLetter);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to apply.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/employer/jobs/${jobId}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Application submitted successfully");
      await checkIfApplied(jobId, setJob);
      setShowApplyModal(false);
    } catch (error) {
      console.error("Error submitting application:", error.response?.data || error.message);
      toast.error("Failed to submit application");
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <p className="text-lg text-gray-600">Loading job details...</p>
      </div>
    );
  if (!job)
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <p className="text-lg text-gray-600">Job not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-300 to-green-700 py-6 px-2 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-900 text-center">
          Apply for Job
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-900">{job.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="mb-2">
              <span className="font-semibold text-green-800">Company:</span>{" "}
              <span className="text-gray-700">{job.companyName}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-green-800">Location:</span>{" "}
              <span className="text-gray-700">{job.location}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-green-800">Salary:</span>{" "}
              <span className="text-gray-700">{job.salary}</span>
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-semibold text-green-800">Posted By:</span>{" "}
              <span className="text-gray-700">
                {job.createdBy?.username} ({job.createdBy?.email})
              </span>
            </p>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-gray-800">{job.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <button
            onClick={() => {
              if (!job.applied && !job.notLoggedIn) setShowApplyModal(true);
            }}
            className={`transition-all duration-200 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 px-6 py-2 rounded-lg text-base w-full sm:w-auto ${
              job.applied
                ? "bg-green-200 text-green-700 cursor-not-allowed"
                : job.notLoggedIn
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            style={{ minWidth: 150 }}
            disabled={job.applied || job.notLoggedIn}
          >
            {job.notLoggedIn
              ? "Login to Apply"
              : job.applied
              ? "Already Applied"
              : "Apply Now"}
          </button>
        </div>

        {showApplyModal && (
          <div className="fixed inset-0 bg-gradient-to-br from-white-300 to-green-700 bg-opacity-50 flex justify-center items-center z-50 px-2">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-green-900">
                Apply for {job.title}
              </h2>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setApplication((prev) => ({ ...prev, cv: e.target.files[0] }))
                }
                className="mb-4 w-full border border-gray-300 rounded p-2 text-sm"
                disabled={job.applied}
              />
              <textarea
                placeholder="Cover Letter"
                value={application.coverLetter}
                onChange={(e) =>
                  setApplication((prev) => ({
                    ...prev,
                    coverLetter: e.target.value,
                  }))
                }
                className="mb-4 w-full border border-gray-300 rounded p-2 text-sm resize-none"
                rows={4}
                disabled={job.applied}
              ></textarea>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={job.applied}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
