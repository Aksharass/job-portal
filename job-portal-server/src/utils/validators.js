// utils/validation.js

const validator = require("validator");

const isValidEmail = (email) => {
  return validator.isEmail(email);
};

const isValidPassword = (password) => {
  // Minimum 6 characters
  return typeof password === 'string' && password.length >= 6;
};

const isValidName = (name) => {
  return typeof name === 'string' && name.trim().length > 1;
};

const isValidRole = (role) => {
  return ['admin', 'employer', 'jobseeker'].includes(role);
};

const isValidJobData = (data) => {
  const { title, description, location, salary } = data;
  return (
    typeof title === 'string' &&
    title.trim().length > 3 &&
    typeof description === 'string' &&
    description.trim().length > 10 &&
    typeof location === 'string' &&
    location.trim().length > 3 &&
    typeof salary === 'number'
  );
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidRole,
  isValidJobData,
};
