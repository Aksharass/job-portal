import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import logo from "../assets/logoaks.png"; // Adjust the path to your logo image

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-green-900 text-white p-3">
      <div className="container mx-auto flex justify-between items-center ps-3 pe-3">
        <div className="flex items-center">
          {/* Add your logo image here */}
          <img
            src={logo}
            alt="Logo"
            className="h-11 w-11 mr-2"
          />
          <Link to="/" className="font-bold text-xl ">
            JobPortal
          </Link>
        </div>
        <div className="space-x-4">
          {user ? (
            <>
              {user.role === "jobseeker" && (
                <>
                  <Link
                    to="/jobs"
                    className="ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                  >
                    Jobs
                  </Link>
                  <Link
                    to="/jobseeker/applications"
                    className="ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/jobseeker/edit-profile"
                    className="ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                  >
                    Edit Profile
                  </Link>
                </>
              )}
              {user.role === "employer" && (
                <Link
                  to="/employer/dashboard"
                  className="ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                >
                  Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
