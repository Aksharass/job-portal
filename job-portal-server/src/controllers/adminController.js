const Job = require('../models/Job');

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

exports.approveJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.json(job);
};

exports.deactivateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
  res.json(job);
};
