import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import JobSearch from "./JobSearch";
import { fetchJobs } from "../../api/jobs";
import { fetchUserApplications } from "../../api/applications";
import { toast } from "react-toastify";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
    salaryRange: "",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    if (!hasSearched) {
      fetchAllJobs();
    } else {
      fetchJobList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSearched]);

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs(); // fetch all jobs, no params
      if (data && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        toast.error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobList = async (customFilters) => {
    setLoading(true);
    try {
      const filterObj = { ...(customFilters || filters) };
      Object.keys(filterObj).forEach((key) => {
        if (filterObj[key] === "") delete filterObj[key];
      });
      const data = await fetchJobs(filterObj);
      if (data && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        toast.error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const applications = await fetchUserApplications(token);
        setAppliedJobIds(
          applications.map((app) => app.jobId || app.job || app.id)
        );
      } catch (error) {
        console.error("Failed to fetch applications", error);
        toast.error("Failed to fetch applications");
      }
    };
    fetchAppliedJobs();
  }, []);

  const handleFilterChange = (filters) => {
    setFilters(filters);
    setHasSearched(true);
    fetchJobList(filters);
  };

  // Pagination logic
  const totalJobs = jobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIdx = (currentPage - 1) * jobsPerPage;
  const endIdx = startIdx + jobsPerPage;
  const jobsToShow = jobs.slice(startIdx, endIdx);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-300 to-green-700 px-2 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-black">
          Available Jobs
        </h1>

        {/* Job Search Component */}
        <div className="mb-6">
          <JobSearch filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Job List */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {Array.isArray(jobsToShow) && jobsToShow.length > 0 ? (
            jobsToShow.map((job) => (
              <div key={job._id} className="flex p-2">
                <JobCard
                  job={job}
                  applied={appliedJobIds.includes(job._id)}
                  className="w-full"
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No jobs found. Please try adjusting your search criteria.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded bg-black text-white font-semibold transition ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-900"
              }`}
            >
              Previous
            </button>
            <span className="font-semibold text-black">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded bg-black text-white font-semibold transition ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-900"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
