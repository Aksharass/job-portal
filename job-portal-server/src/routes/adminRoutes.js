const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/roleMiddleware');
const {
  getAllJobs, approveJob, deactivateJob
} = require('../controllers/adminController');

router.get('/jobs', verifyToken, permit('admin'), getAllJobs);
router.put('/jobs/:id/approve', verifyToken, permit('admin'), approveJob);
router.put('/jobs/:id/deactivate', verifyToken, permit('admin'), deactivateJob);

module.exports = router;
