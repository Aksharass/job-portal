import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../utils/roles";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/Dashboard";
import ManageJobs from "../pages/admin/ManageJobs";

import EmployerDashboard from "../pages/employer/EmployerDashboard";
import PostJob from "../pages/employer/PostJob";
import ViewApplicants from "../pages/employer/ViewApplicants";

import JobList from "../pages/jobseeker/JobList";
import JobDetails from "../pages/jobseeker/JobDetails";
import ApplyJob from "../pages/jobseeker/ApplyJob";
import Profile from "../pages/jobseeker/Profile";
import Applications from "../pages/jobseeker/Applications";
import EditProfile from "../pages/jobseeker/EditProfile";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Admin */}
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute roles={[ROLES.ADMIN]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/manage-jobs"
      element={
        <ProtectedRoute roles={[ROLES.ADMIN]}>
          <ManageJobs />
        </ProtectedRoute>
      }
    />

    {/* Employer */}
    <Route
      path="/employer/dashboard"
      element={
        <ProtectedRoute roles={[ROLES.EMPLOYER]}>
          <EmployerDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employer/post-job"
      element={
        <ProtectedRoute roles={[ROLES.EMPLOYER]}>
          <PostJob />
        </ProtectedRoute>
      }
    />
    <Route
      path="/employer/jobs/:jobId/applicants"
      element={
        <ProtectedRoute roles={[ROLES.EMPLOYER]}>
          <ViewApplicants />
        </ProtectedRoute>
      }
    />

    {/* Job Seeker */}
    <Route
      path="/jobs"
      element={
        <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
          <JobList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobs/:jobId"
      element={
        <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
          <JobDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobs/:jobId/apply"
      element={
        <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
          <ApplyJob />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobseeker/applications"
      element={
        <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
          <Applications />
        </ProtectedRoute>
      }
    />
    <Route
      path="/jobseeker/edit-profile"
      element={
        <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
          <EditProfile />
        </ProtectedRoute>
      }
    />

    {/* Default Redirect */}
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;
