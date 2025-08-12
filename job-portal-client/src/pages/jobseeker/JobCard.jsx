import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="flex flex-col justify-between h-full bg-white border border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-lg transition duration-300 w-full">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-1 text-black break-words">
          {job.title || "No Title"}
        </h3>
        <p className="text-gray-700 mb-1 font-medium">
          {job.companyName || "Unknown Company"}
        </p>
        <p className="text-gray-500 mb-3 text-sm">
          Location: {job.location || "Not Specified"}
        </p>
      </div>
      <div className="mt-auto flex items-center">
        <Link
          to={`/jobs/${job._id}`}
          className="inline-block bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-900 transition w-full text-center sm:w-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
