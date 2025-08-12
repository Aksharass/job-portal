const Job = require('../models/Job'); // Assuming Mongoose Job model

const createJob = async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      postedBy: req.user.id,
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error });
  }
};

const updateJob = async (req, res) => {
  try {
    const updated = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error });
  }
};

const deleteJob = async (req, res) => {
  try {
    const deleted = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicants');
    if (!job || job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get applicants', error });
  }
};

module.exports = {
  createJob,
  getEmployerJobs,
  updateJob,
  deleteJob,
  getJobApplicants,
};
