import React, { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../services/UserService";
import { Pencil, Check, Camera } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState({});
  const fileInputRef = useRef(null);

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

  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger input file saat FAB diklik
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, photo: imageUrl }));
      // Tambahkan logika upload ke server jika perlu
      console.log("Selected image:", file.name);
    }
  };

  const renderField = (label, field) => (
    <div className="py-4 border-b border-gray-300">
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
          className="ml-4 text-gray-600 hover:text-gray-900"
        >
          {editField === field ? <Check /> : <Pencil />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center items-start my-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl pb-8 flex flex-col items-center">
        {/* Profile Picture with FAB */}
        <div className="relative mt-8">
          <img
            src={profile.photo || "https://via.placeholder.com/150"}
            className="rounded-full w-40 h-40 object-cover bg-black"
            alt="Profile"
          />
          <button
            type="button"
            onClick={handleImageClick}
            className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            <Camera className="w-5 h-5 text-gray-700" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Profile Info */}
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
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-800 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
