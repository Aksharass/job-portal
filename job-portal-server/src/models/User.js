const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'employer', 'jobseeker'],
    default: 'jobseeker',
  },
  location: { type: String },         // <-- add this
  qualification: { type: String },    // <-- add this
  resume: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
