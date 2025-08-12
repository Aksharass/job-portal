const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/roleMiddleware');
const {
  createJob,
  getJobs,
  applyJob,
  getApplicants,
  getJobById, // Import the new controller
  deleteJob, // Import the deleteJob controller
  updateJob, // Import the updateJob controller
  checkJobExists, // Import the checkJobExists controller
  searchJobs, // Import the searchJobs controller
  checkIfApplied // Import the checkIfApplied controller
} = require('../controllers/jobController');

console.log({
  createJob,
  getJobs,
  applyJob,
  getApplicants
}); // Add this line to debug

// Route to search jobs (should be before any /:id route)
router.get('/search', searchJobs);

// Public route to get all jobs
router.get('/', getJobs); // getJobs must be a function

// Public route to get a specific job by ID
router.get('/:id', getJobById);

// Employer route to create a job
router.post('/', verifyToken, permit('employer'), createJob);

// Jobseeker route to apply for a job
router.post('/:id/apply', verifyToken, permit('jobseeker'), applyJob);

// Employer route to get all applicants for a job
router.get('/:id/applicants', verifyToken, permit('employer'), getApplicants);

// Employer route to delete a job
router.delete('/:id', verifyToken, permit('employer'), deleteJob);

// Employer route to update a job
router.put('/:id', verifyToken, permit('employer'), updateJob);

// Temporary route for debugging
router.get('/check/:id', checkJobExists);

// Route to search jobs
router.get('/search', searchJobs);

// Add a route to check if a user has already applied for a job
router.get('/:id/check-application', verifyToken, permit('jobseeker'), checkIfApplied);

module.exports = router;
