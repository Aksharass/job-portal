import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync } from "../../redux/authSlice";
import { Navigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  if (user) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" />;
      case "employer":
        return <Navigate to="/employer/dashboard" />;
      case "jobseeker":
        return <Navigate to="/jobs" />;
      default:
        return <Navigate to="/" />;
    }
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter both email and password");
      return;
    }
    dispatch(loginUserAsync(form));
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-transparent m-0 p-0 bg-gradient-to-br from-white-300 to-green-700">
      <div className="w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              autoComplete="current-password"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-green-900 text-white py-3 rounded font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-800 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
