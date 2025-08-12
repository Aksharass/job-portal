const Job = require('../models/Job');
const mongoose = require('mongoose'); // Add this at the top

// Create a new job
const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, companyName, jobType, expireDate } = req.body;
    if (!companyName || !jobType) {
      return res.status(400).json({ message: 'Company name and job type are required.' });
    }
    const jobData = { title, description, location, salary, companyName, jobType };
    if (expireDate) jobData.expireDate = expireDate;

    if (req.user && req.user.id) {
      jobData.createdBy = req.user.id;
    }

    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'username email');
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// Apply for a job
const Application = require('../models/Application');
const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.applicants.includes(userId)) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Add user to job's applicants array
    job.applicants.push(userId);
    await job.save();

    // Create an Application document
    await Application.create({
      job: jobId,
      applicant: userId,
      status: 'Applied',
    });

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// Get applicants for a job
const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate('applicants', 'username email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ applicants: job.applicants });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// Get a specific job by ID
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid Job ID' });
    }

    console.log("Received jobId:", jobId); // Debugging log

    const job = await Job.findById(jobId).populate('createdBy', 'username email');
    console.log("Job found:", job); // Debugging log

    if (!job) {
      console.log("Job not found for ID:", jobId); // Debugging log
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error("Error in getJobById:", error); // Debugging log
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    console.log("Job createdBy:", job.createdBy.toString()); // Debugging log
    console.log("Authenticated user ID:", userId); // Debugging log
    console.log("Authenticated user:", req.user); // Debugging log to check user details

    // Allow admins to delete any job
    const userRole = req.user.role; // Assuming role is stored in req.user
    if (userRole === 'admin') {
      await Job.findByIdAndDelete(jobId);
      return res.status(200).json({ message: 'Job deleted successfully by admin' });
    }

    if (job.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this job' });
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this job' });
    }

    // Only allow updating companyName and jobType if provided
    const updateData = { ...req.body };
    if (updateData.companyName === undefined) delete updateData.companyName;
    if (updateData.jobType === undefined) delete updateData.jobType;
    if (updateData.expireDate === undefined) delete updateData.expireDate;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// Search jobs by keyword, location, job type, salary range, with pagination and sorting
const searchJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      jobType,
      salaryMin,
      salaryMax,
      page = 1,
      limit = 10,
    } = req.query;

    // Build the query object
    const query = {};
    const andFilters = [];
    if (keyword) {
      andFilters.push({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ]
      });
    }
    if (location) {
      andFilters.push({ location: { $regex: location, $options: 'i' } });
    }
    if (jobType) {
      andFilters.push({ jobType });
    }
    if (salaryMin || salaryMax) {
      const salaryFilter = {};
      if (salaryMin) salaryFilter.$gte = parseInt(salaryMin);
      if (salaryMax) salaryFilter.$lte = parseInt(salaryMax);
      andFilters.push({ salary: salaryFilter });
    }
    // Only return jobs that are not expired (expireDate in the future or not set)
    const now = new Date();
    andFilters.push({
      $or: [
        { expireDate: { $exists: false } },
        { expireDate: null },
        { expireDate: { $gt: now } }
      ]
    });
    if (andFilters.length > 0) {
      query.$and = andFilters;
    }

  // Pagination
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 10;
  const skip = (pageNum - 1) * limitNum;

  // Debug: print query
  console.log('[searchJobs] MongoDB query:', JSON.stringify(query));


  // Sorting removed

    // Get total count for pagination
    const total = await Job.countDocuments(query);



    let jobs = await Job.find(query)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'username email');

    // Debug log: print job order
    console.log('[searchJobs] jobs returned:', jobs.map(j => ({
      _id: j._id,
      title: j.title,
      salary: j.salary,
      createdAt: j.createdAt
    })));

    res.status(200).json({
      jobs,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

// Temporary debugging route to check if a job exists in the database
const checkJobExists = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job exists", job });
  } catch (error) {
    res.status(500).json({ message: "Error checking job", error: error.message });
  }
};

// Check if a user has already applied for a job
const checkIfApplied = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applied = job.applicants.includes(userId);
    res.status(200).json({ applied });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  applyJob,
  getApplicants,
  getJobById,
  deleteJob,
  updateJob,
  searchJobs,
  checkJobExists,
  checkIfApplied,
};
