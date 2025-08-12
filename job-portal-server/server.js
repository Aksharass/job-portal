// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
//const fileUpload = require('express-fileupload');
const path = require('path');

// Load routes
const authRoutes = require('./src/routes/authRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
//app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employer/jobs', jobRoutes);
app.use('/api/jobs', jobRoutes); // Added for job search
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
  res.send('Job Portal API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connected'))
.catch(err => console.error(' MongoDB error:', err));

// Debugging log for JWT_SECRET
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
