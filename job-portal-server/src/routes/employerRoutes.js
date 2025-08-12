const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Get applicants for a job
router.get('/jobs/:jobId/applicants', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applicants', 'username email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    // Optionally, check if req.user is the employer who posted the job
    res.json({ applicants: job.applicants });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;