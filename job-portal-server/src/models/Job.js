const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    companyName: { type: String, required: true }, // <-- Add this line
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract'],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
