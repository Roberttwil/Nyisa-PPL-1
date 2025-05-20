import React, { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../services/UserService";
import { uploadUserPhoto } from "../services/UploadService";
import { Pencil, Check, Camera, X } from "lucide-react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null); // Save original file
  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 30,
    height: 30,
    aspect: 1,
  });

  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const cropContainerRef = useRef(null);

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
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

      if (file.size > maxSizeInBytes) {
        alert(
          "Error: Maximum image size is 2MB. Please choose a smaller image."
        );
        e.target.value = null; // reset input file so it can be uploaded again
        return;
      }

      // Verify if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }

      setSelectedFileObj(file); // Save original file
      setSelectedFile(URL.createObjectURL(file));
      setCompletedCrop(null); // reset completed crop
    }
  };

  const onImageLoaded = (img) => {
    imgRef.current = img;

    // Make sure image is loaded before continuing
    if (img && img.complete) {
      const width = img.width;
      const height = img.height;
      const smallest = Math.min(width, height);

      // Set default crop in the center of the image
      const initialCrop = {
        unit: "%",
        x: (width - smallest) / 2,
        y: (height - smallest) / 2,
        width: smallest,
        height: smallest,
        aspect: 1,
      };

      setCrop(initialCrop);
    }

    return false; // Important! So ReactCrop knows it's been handled
  };

  // Function to create a file from cropped image
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    // Draw circular crop
    ctx.beginPath();
    ctx.arc(
      crop.width / 2,
      crop.height / 2,
      Math.min(crop.width, crop.height) / 2,
      0,
      2 * Math.PI
    );
    ctx.clip();

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Convert canvas to file
    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        // Create a File from Blob for better compatibility
        const file = new File([blob], "profile-photo.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    });
  };

  const handleSaveCroppedImage = async () => {
    const image = imgRef.current;
    const crop = completedCrop;

    // Validation
    if (!image || !crop) {
      alert("Image is not ready for processing.");
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Upload photo directly similar to Owner.jsx approach
      if (selectedFileObj) {
        // Direct file upload approach (like in Owner.jsx)
        const result = await uploadUserPhoto(selectedFileObj, token);
        
        // Update state with new photo URL
        if (result && result.photo) {
          setProfile((prev) => ({ ...prev, photo: result.photo }));
          alert("Profile photo updated successfully!");
        } else {
          // If no photo URL is returned, reload profile
          const updatedProfile = await getProfile();
          setProfile(updatedProfile);
          alert("Profile photo updated!");
        }
        
        handleCloseModal();
      } else {
        alert("No file selected");
      }
      
      /* 
      // COMMENTED OUT: Original cropping functionality
      // Generate cropped image file
      const croppedImageFile = await getCroppedImg(image, crop);
      
      // Upload with file directly without converting to blob
      const result = await uploadUserPhoto(croppedImageFile, token);
      
      // Update state with new photo URL
      setProfile((prev) => ({ ...prev, photo: result.photo }));
      */
    } catch (err) {
      console.error("Upload failed:", err);
      console.error("Error details:", err.response?.data || err.message);
      alert("Failed to upload profile photo.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setSelectedFileObj(null);
    setCompletedCrop(null);
  };

  const onCropChange = (newCrop) => {
    // Ensure that the crop values are valid before updating state
    if (
      newCrop &&
      !isNaN(newCrop.x) &&
      !isNaN(newCrop.y) &&
      !isNaN(newCrop.width) &&
      !isNaN(newCrop.height)
    ) {
      setCrop(newCrop);
    }
  };

  const onCropComplete = (crop) => {
    // Ensure that the crop values are valid before updating completedCrop
    if (
      crop &&
      !isNaN(crop.x) &&
      !isNaN(crop.y) &&
      !isNaN(crop.width) &&
      !isNaN(crop.height)
    ) {
      setCompletedCrop(crop);
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
            src={profile.photo || "https://via.placeholder.com/150"}
            className="rounded-full w-40 h-40 object-cover bg-black"
            alt="Profile"
          />
          <button
            type="button"
            onClick={handleImageClick}
            className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            <Camera className="w-5 h-5 text-gray-700 cursor-pointer" />
          </button>
        </div>

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

      {/* Modal Cropper */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Edit Profile Picture
            </h2>

            {/* Upload File */}
            <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition mb-4 self-center">
              Choose File
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Crop & Preview Container */}
            {selectedFile && (
              <div
                ref={cropContainerRef}
                className="relative flex flex-col items-center overflow-auto"
                style={{ maxHeight: "70vh", maxWidth: "100%" }}
              >
                {/* Preview Image */}
                <div className="relative w-full max-w-xs h-auto max-h-[300px] mb-6">
                  {/* ReactCrop Container */}
                  <ReactCrop
                    src={selectedFile}
                    crop={crop}
                    keepSelection
                    circularCrop
                    aspect="1"
                    onChange={onCropChange}
                    onComplete={onCropComplete}
                    onImageLoaded={onImageLoaded}
                  >
                    <img
                      src={selectedFile}
                      alt="Selected Preview"
                      className="w-full h-auto"
                      style={{ maxHeight: "70vh" }}
                    />
                  </ReactCrop>
                </div>

                <button
                  onClick={handleSaveCroppedImage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  Save Image
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;