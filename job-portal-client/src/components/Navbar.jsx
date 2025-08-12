import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import logo from "../assets/Jobportallogo.png"; // Adjust the path to your logo image

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-green-900 text-white p-3 border-b border-green-700 w-full pb-2">
      <div className="container mx-auto flex justify-between items-center ps-3 pe-3">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-11 w-11 mr-2" />
          <Link to="/" className="font-bold text-xl ">
            JobPortal
          </Link>
        </div>
        {/* Hamburger Icon for small screens */}
        <div className="md:hidden">
          <button
            onClick={handleMenuToggle}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Overlay for mobile menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-opacity-30 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
        {/* Menu Links */}
        <div
          className={`md:flex md:items-center md:justify-center ${
            menuOpen
              ? "flex flex-col items-center absolute top-16 left-0 w-full bg-green-900 z-50 p-4 space-y-2"
              : "hidden"
          } md:static md:bg-transparent md:p-0 md:space-y-0`}
        >
          {user ? (
            <>
              {user.role === "jobseeker" && (
                <>
                  <Link
                    to="/jobs"
                    className="block w-full md:inline md:w-auto border-b border-green-700 pb-2 mb-2 md:border-none md:pb-0 md:mb-0 text-center ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    Jobs
                  </Link>
                  <Link
                    to="/jobseeker/applications"
                    className="block w-full md:inline md:w-auto border-b border-green-700 pb-2 mb-2 md:border-none md:pb-0 md:mb-0 text-center ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/jobseeker/edit-profile"
                    className="block w-full md:inline md:w-auto border-b border-green-700 pb-2 mb-2 md:border-none md:pb-0 md:mb-0 text-center ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    Edit Profile
                  </Link>
                </>
              )}
              {user.role === "employer" && (
                <Link
                  to="/employer/dashboard"
                  className="block w-full md:inline md:w-auto border-b border-green-700 pb-2 mb-2 md:border-none md:pb-0 md:mb-0 text-center ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block w-full md:inline md:w-auto border-b border-green-700 pb-2 mb-2 md:border-none md:pb-0 md:mb-0 text-center ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full md:inline md:w-auto border-b border-green-700 pb-2 mb-2 md:border-none md:pb-0 md:mb-0 text-center ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block w-full md:inline md:w-auto border-b border-green-700 pb-2 mb-2 md:border-none md:pb-0 md:mb-0 text-center ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full md:inline md:w-auto border-b border-green-700 pb-2 mb-2 md:border-none md:pb-0 md:mb-0 text-center ps-3 pe-2 transition-colors duration-200 hover:text-green-300 rounded px-2 py-1"
                onClick={() => setMenuOpen(false)}
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
