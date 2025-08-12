import React, { useState } from 'react';

const defaultFilters = {
  keyword: '',
  location: '',
  jobType: '',
  salaryMin: '',
  salaryMax: ''
};

const JobSearch = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({ ...defaultFilters, ...filters });
  const [error, setError] = useState(null);

  const validJobTypes = ['full-time', 'part-time', 'contract'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (localFilters.jobType && !validJobTypes.includes(localFilters.jobType.toLowerCase())) {
      setError('Invalid job type. Please select a valid option.');
      return;
    }
    if (
      localFilters.salaryMin &&
      localFilters.salaryMax &&
      parseInt(localFilters.salaryMax) < parseInt(localFilters.salaryMin)
    ) {
      setError('Max salary must be greater than or equal to Min salary.');
      return;
    }
    setError(null);
    // Respond immediately by updating filters, no loading page
    onFilterChange(localFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 w-full">
      <h2 className="text-center text-xl font-semibold mb-4 text-black">Search Jobs</h2>
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch w-full"
      >
        <input
          type="text"
          name="keyword"
          placeholder="Keyword"
          value={localFilters.keyword ?? ''}
          onChange={handleInputChange}
          className="flex-1 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={localFilters.location ?? ''}
          onChange={handleInputChange}
          className="flex-1 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <select
          name="jobType"
          value={localFilters.jobType ?? ''}
          onChange={handleInputChange}
          className="flex-1 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Job Type</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
        </select>
        <input
          type="number"
          name="salaryMin"
          placeholder="Min Salary"
          value={localFilters.salaryMin ?? ''}
          onChange={handleInputChange}
          className="flex-1 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="number"
          name="salaryMax"
          placeholder="Max Salary"
          value={localFilters.salaryMax ?? ''}
          onChange={handleInputChange}
          className="flex-1 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-900 transition w-full md:w-auto"
        >
          Search
        </button>
      </form>
      {error && (
        <p className="text-red-600 mt-2 text-center">{error}</p>
      )}
    </div>
  );
};

export default JobSearch;
