import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE}/user/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-white-300 to-green-700 px-2 py-6'> 
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-10 mt-6 bg-white shadow-md rounded-md ">
      <h1 className="text-2xl font-bold mb-6 text-center">My Applications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full w-full">
          <thead className="bg-gray-100 hidden sm:table-header-group">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-black">Job Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-black">Company</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="block sm:table-row border-b border-gray-200 last:border-b-0 transition hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-gray-700 block sm:table-cell">
                  <span className="font-semibold sm:hidden">Job Title: </span>
                  {app.jobTitle}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 block sm:table-cell">
                  <span className="font-semibold sm:hidden">Company: </span>
                  {app.company}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 block sm:table-cell">
                  <span className="font-semibold sm:hidden">Status: </span>
                  {app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default Applications;
