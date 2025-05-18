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
      alert("Profile updated!");
    } catch (err) {
      console.error("Update error:", err.message);
      alert("Failed to update");
    }
  };

  const handleProfilePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // File size validation (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Photo size must be less than 2MB");
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
      alert("Please select a photo to upload");
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
        alert("Profile photo updated successfully!");
      } else {
        // If no photo URL is returned, refresh the profile to get the latest data
        const updatedProfile = await getProfile();
        setProfile(updatedProfile);
        alert("Profile photo updated!");
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

      alert(err?.message || "Failed to update profile photo");
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
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-800 transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;