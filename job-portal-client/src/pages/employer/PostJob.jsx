import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postJobAsync, updateJobAsync } from "../../redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const jobTypes = ["full-time", "part-time", "contract"];

const PostJob = ({ jobToEdit, onJobAdded, onJobUpdated }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    companyName: "",
    jobType: jobTypes[0] || "",
    expirationDate: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobToEdit) {
      setForm({
        title: jobToEdit.title || "",
        description: jobToEdit.description || "",
        location: jobToEdit.location || "",
        salary: jobToEdit.salary || "",
        companyName: jobToEdit.companyName || "",
        jobType: jobToEdit.jobType || jobTypes[0] || "",
        expirationDate: jobToEdit.expirationDate ? new Date(jobToEdit.expirationDate).toISOString().split('T')[0] : "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        companyName: "",
        jobType: jobTypes[0] || "",
        expirationDate: "",
      }); // Reset form when no jobToEdit
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "salary" ? parseFloat(value) || "" : value, // Ensure salary is a number
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for numeric salary
    if (isNaN(form.salary) || form.salary <= 0) {
      toast.error("Salary must be a positive number.");
      return;
    }

    try {
      if (jobToEdit) {
        await dispatch(updateJobAsync({ jobId: jobToEdit._id, jobData: form, token })).unwrap();
        toast.success("Job updated successfully!");
        if (onJobUpdated) onJobUpdated({ ...form, _id: jobToEdit._id }); // Notify parent component of the updated job
      } else {
        const result = await dispatch(postJobAsync({ jobData: form, token })).unwrap();
        toast.success("Job posted successfully!");
        if (onJobAdded) onJobAdded(result); // Notify parent component of the new job
      }
      setForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        companyName: "",
        jobType: jobTypes[0] || "",
        expirationDate: "",
      }); // Clear form after posting or updating a job
      navigate("/employer/dashboard");
    } catch (err) {
      toast.error("Failed to save job. Please try again.");
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 bg-transparent">
      <div className="w-full max-w-md sm:max-w-lg p-8 sm:p-10 rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-black">
          {jobToEdit ? "Edit Job" : "Post a Job"}
        </h1>
        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
            className="w-full border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
            className="w-full border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            required
            className="w-full border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="expirationDate"
            value={form.expirationDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition">
            {jobToEdit ? "Update Job" : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
