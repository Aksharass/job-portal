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

// Function to update user role
const updateUserRole = async (userId, newRole) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return;
    }

    user.role = newRole;
    await user.save();
    console.log(`User role updated to ${newRole}`);
  } catch (err) {
    console.error('Error updating user role:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Replace with the user ID and desired role
const userId = '6895c34e3a673d8c12f0a2aa';
const newRole = 'employer';
updateUserRole(userId, newRole);
