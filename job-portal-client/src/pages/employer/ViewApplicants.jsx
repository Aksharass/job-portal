import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const ViewApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
           `${API_BASE}/employer/jobs/${jobId}/applicants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplicants(res.data.applicants || []);
      } catch {
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-green-900">Applicants</h2>
      {loading ? (
        <p>Loading...</p>
      ) : applicants.length === 0 ? (
        <p>No applicants for this job.</p>
      ) : (
        <ul className="divide-y divide-green-200">
          {applicants.map((applicant) => (
            <li key={applicant._id} className="py-2">
              <div className="font-semibold">{applicant.username}</div>
              <div className="text-sm text-gray-600">{applicant.email}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Link
          to={`/employer/jobs/${jobId}`}
          className="text-green-600 hover:underline"
        >
          Back to Job Details
        </Link>
      </div>
    </div>
  );
};

export default ViewApplicants;
