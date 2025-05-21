import React, { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../services/UserService";
import { uploadUserPhoto } from "../services/UploadService";
import { Pencil, Check, Camera } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const profilePhotoRef = useRef(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setForm(data);
      } catch (err) {
        console.error("Fetch profile error:", err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditToggle = (field) => {
    if (editField === field) {
      handleUpdate(field);
    } else {
      setEditField(field);
    }
  };

  const handleUpdate = async (field) => {
    try {
      const updated = await updateProfile({ ...profile, [field]: form[field] });
      setProfile(updated.profile);
      setEditField(null);
      setPopup({
        show: true,
        type: 'success',
        message: 'Profile updated successfully!',
      });
    } catch (err) {
      console.error("Update error:", err.message);
      setPopup({
        show: true,
        type: 'error',
        message: 'Failed to update profile. Please try again.',
      });
    }
  };

  const handleProfilePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // File size validation (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setPopup({
          show: true,
          type: "error",
          message: "Photo size must be less than 2MB",
        });
        e.target.value = null; // Reset file input
        return;
      }

      setProfilePhoto(file);

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewImg = document.getElementById("profile-preview");
        if (previewImg) {
          previewImg.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePhoto = async () => {
    if (!profilePhoto) {
      setPopup({
        show: true,
        type: "error",
        message: "Please select a photo to upload",
      });;
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Use the UploadService to upload the photo
      const result = await uploadUserPhoto(profilePhoto, token);

      if (result && result.photo) {
        // Update local state with new photo URL if returned by API
        setProfile((prev) => ({ ...prev, photo: result.photo }));
        setPopup({
          show: true,
          type: 'success',
          message: 'Profile photo updated successfully!',
        });
      } else {
        // If no photo URL is returned, refresh the profile to get the latest data
        const updatedProfile = await getProfile();
        setProfile(updatedProfile);
        setPopup({
          show: true,
          type: 'success',
          message: 'Profile photo updated',
        });
      }

      // Reset file input and state
      setProfilePhoto(null);
      if (profilePhotoRef.current) {
        profilePhotoRef.current.value = "";
      }
    } catch (err) {
      console.error("Error updating profile photo:", err);

      // More detailed error logging
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }

      setPopup({
        show: true,
        type: 'error',
        message: err?.message || 'Failed to update profile photo.',
      });;
    }
  };

  // Function to trigger profile photo file input
  const triggerProfilePhotoUpload = () => {
    if (profilePhotoRef.current) {
      profilePhotoRef.current.click();
    }
  };

  const renderField = (label, field) => (
    <div className="py-3">
      <label className="text-gray-600 font-semibold block mb-1">{label}</label>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {editField === field ? (
            <input
              name={field}
              value={form[field] || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
            />
          ) : (
            <p className="text-lg text-gray-900">{profile[field] || "-"}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleEditToggle(field)}
          className="ml-4 text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          {editField === field ? <Check /> : <Pencil />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center items-start my-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl pb-8 flex flex-col items-center">
        <div className="relative mt-8">
          <img
            id="profile-preview"
            src={profile.photo || "https://via.placeholder.com/150"}
            className="rounded-full w-40 h-40 object-cover bg-gray-200"
            alt="Profile"
          />
          <input
            type="file"
            ref={profilePhotoRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePhotoChange}
          />
          <button
            type="button"
            onClick={triggerProfilePhotoUpload}
            className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            <Camera className="w-5 h-5 text-gray-700 cursor-pointer" />
          </button>
        </div>

        {/* Show upload button when photo is selected */}
        {profilePhoto && (
          <button
            type="button"
            onClick={handleUploadProfilePhoto}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Upload New Photo
          </button>
        )}

        <div className="w-full mt-8 px-6">
          {renderField("Name", "name")}
          {renderField("Email", "email")}
          {renderField("Phone", "phone")}
          {renderField("Address", "address")}
        </div>

        <div className="mt-10">
          <button
            onClick={() => setConfirmLogout(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
      {popup.show && (
        <div className="fixed inset-0 bg-gray-600/30 flex justify-center items-center z-50">
          <div className={`bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center border ${popup.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${popup.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {popup.type === 'success' ? 'Success!' : 'Error!'}
            </h2>
            <p className="mb-4">{popup.message}</p>
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setConfirmLogout(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center border border-red-500">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to sign out?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setConfirmLogout(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  window.location.href = "/";
                }}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Profile;
