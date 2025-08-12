const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Register request received:', { username, email, password }); // Log incoming request data

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email); // Log existing user
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: req.body.role || 'jobseeker' // Assign role from request or default to 'jobseeker'
    });

    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser); // Log saved user

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request received:', { email, password }); // Log incoming request data

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email); // Log user not found
      return res.status(400).json({ msg: 'Invalid credentials - user not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email); // Log password mismatch
      return res.status(400).json({ msg: 'Invalid credentials - password mismatch' });
    }

    console.log('User authenticated successfully:', user.email); // Log successful authentication

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Return response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
} catch (err) {
  console.error('Login error stack:', err); // full error object
  res.status(500).json({ msg: 'Server error', error: err.message });
}
};