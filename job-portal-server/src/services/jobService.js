// services/jobService.js

const Job = require('../models/Job');
const Application = require('../models/Application');

const createJob = async (jobData) => {
  const job = new Job(jobData);
  return await job.save();
};

const getAllJobs = async () => {
  return await Job.find().populate('employer', 'name email');
};

const getJobsByEmployer = async (employerId) => {
  return await Job.find({ employer: employerId });
};

const updateJob = async (jobId, employerId, updateData) => {
  return await Job.findOneAndUpdate(
    { _id: jobId, employer: employerId },
    updateData,
    { new: true }
  );
};

const deleteJob = async (jobId, employerId) => {
  return await Job.findOneAndDelete({ _id: jobId, employer: employerId });
};

const applyToJob = async (jobId, jobSeekerId) => {
  // Check if already applied
  const existingApplication = await Application.findOne({ jobId, jobSeeker: jobSeekerId });
  if (existingApplication) {
    throw new Error('You have already applied to this job');
  }

  const application = new Application({ jobId, jobSeeker: jobSeekerId });
  return await application.save();
};

const getApplicantsForJob = async (jobId) => {
  return await Application.find({ jobId }).populate('jobSeeker', 'name email resume');
};

module.exports = {
  createJob,
  getAllJobs,
  getJobsByEmployer,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicantsForJob,
};
