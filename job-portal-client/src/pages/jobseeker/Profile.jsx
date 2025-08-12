import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState({
    username: "johndoe",
    email: "johndoe@example.com",
    role: "jobseeker",
    resume: null,
  });
  const [editing, setEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (e) => {
    setUser((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    if (user.resume) formData.append("resume", user.resume);

    try {
      await axios.put("http://localhost:5000/api/users/profile", formData);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      {editing ? (
        <div>
          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="w-full border p-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setEditing(false)}
              className="mr-2 px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
