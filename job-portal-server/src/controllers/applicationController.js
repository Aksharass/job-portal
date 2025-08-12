const Application = require('../models/Application');

// Get all applications for the logged-in jobseeker
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ applicant: userId })
      .populate({
        path: 'job',
        select: 'title company location',
        populate: { path: 'createdBy', select: 'username' }
      });
    res.json(applications.map(app => ({
      id: app._id,
      jobTitle: app.job?.title || '',
      company: app.job?.createdBy?.username || '',
      location: app.job?.location || '',
      status: app.status
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};
