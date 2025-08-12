const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/userController');
const { getUserApplications } = require('../controllers/applicationController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');


// Route to get all applications for the logged-in jobseeker
router.get('/applications', verifyToken, getUserApplications);

router.get('/profile/:id', verifyToken, getProfile);
router.put('/profile/:id', verifyToken, upload.single('resume'), updateProfile);

module.exports = router;
