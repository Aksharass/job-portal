const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to check and update user role
const checkUserRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user);

    // Update role if needed
    if (!user.role || user.role !== 'employer') {
      user.role = 'employer';
      await user.save();
      console.log('User role updated to employer');
    } else {
      console.log('User role is already correct:', user.role);
    }
  } catch (err) {
    console.error('Error checking/updating user role:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Replace with the user ID to check/update
const userId = '6895c34e3a673d8c12f0a2aa';
checkUserRole(userId);
