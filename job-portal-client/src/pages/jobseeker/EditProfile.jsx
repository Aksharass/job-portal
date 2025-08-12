import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE = import.meta.env.VITE_API_URL; 

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    location: "",
    qualification: "",
    resume: null,
  });

  const [profileData, setProfileData] = useState(null);
  const [userId, setUserId] = useState(user?._id || null);

  // Decode user ID from token if missing
  useEffect(() => {
    if (!userId) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.id || decoded._id || null);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, [userId]);

  // Fetch profile data
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE}/user/profile/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          // Initialize form with existing values if any
          setFormData({
            location: data.location || "",
            qualification: data.qualification || "",
            resume: null,
          });
        } else {
          console.error("Failed to fetch profile data.");
          toast.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Error fetching profile data");
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("User ID is missing");
      toast.error("User ID is missing");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("location", formData.location);
    formDataToSend.append("qualification", formData.qualification);

    if (formData.resume instanceof File) {
      formDataToSend.append("resume", formData.resume);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/user/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            // Note: Do NOT set 'Content-Type' header when sending FormData!
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        dispatch(setUser(updatedUser));
        setProfileData(updatedUser);
        toast.success("Profile updated successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to update profile:", errorText);
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-300 to-green-700 px-2 py-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md p-4 sm:p-8 flex flex-col md:flex-row gap-8">
        {/* Left: Form */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
            Edit Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display name and email as readonly */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                value={user?.username || ""}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed sm:text-sm"
              />
            </div>
            {/* New editable fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location:
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Qualification:
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resume:
              </label>
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 
                  file:text-sm file:font-semibold file:bg-blue-50 file:text-black hover:file:bg-gray-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md 
                hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </form>
        </div>
        {/* Right: Profile Data */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-md p-4 md:p-8 h-full flex flex-col justify-center shadow-inner border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-center md:text-left text-black ">
              Profile Data
            </h2>
            {profileData ? (
              <div className="space-y-4 text-base">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black-800 w-32">Name:</span>
                  <span className="truncate">{profileData.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black-800 w-32">Email:</span>
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black-800 w-32">Location:</span>
                  <span className="truncate">{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black-800 w-32">Qualification:</span>
                  <span className="truncate">{profileData.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black-800 w-32">Role:</span>
                  <span className="truncate">{profileData.role}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center">Loading profile...</div>
            )}
          </div>
        </div>
      </div>
      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProfile;
