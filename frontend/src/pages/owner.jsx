import React, { useEffect, useState, useRef } from "react";
import { Edit, Trash, Camera, Check, Pencil } from "lucide-react";
import foodService from "../services/FoodService";
import RestoService from "../services/RestoService";
import { uploadRestaurantPhoto } from "../services/UploadService";

const Owner = () => {
  const [foodData, setFoodData] = useState({
    name: "",
    type: "",
    price: "",
    promo_price: "",
    quantity: "",
  });
  const [foodPhoto, setFoodPhoto] = useState(null);
  const [foodIdToUpdate, setFoodIdToUpdate] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [menu, setMenu] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    restaurantName: "",
    rating: 0,
    photo: "",
  });
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const profilePhotoRef = useRef(null);
  const addFoodRef = useRef(null);
  const [isPromoDisabled, setIsPromoDisabled] = useState(false);

  // Modal states
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [confirmAction, setConfirmAction] = useState({
    show: false,
    type: null, // "delete", "update", "add", "logout"
    message: "",
    onConfirm: null,
  });

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Load Owner Profile on Mount by username
  useEffect(() => {
    const fetchProfile = async () => {
      if (username && token) {
        try {
          const result = await RestoService.getOwnerProfile(token);
          setProfile(result);
          setFormData(result); // Initialize form data with profile
          console.log("Fetched profile:", result);
        } catch (err) {
          console.error("Failed to load owner profile:", err);
          showPopup("error", "Failed to load owner profile");
        }
      }
    };
    fetchProfile();
  }, [token, username]);

  // Load Menu on Mount
  useEffect(() => {
    loadMenu();
  }, [profile]);

  // Function to load menu
  const loadMenu = async () => {
    if (profile && profile.owner && profile.owner.restaurant) {
      try {
        const restaurantId = profile.owner.restaurant.id;
        console.log("Fetching foods for restaurant ID:", restaurantId);

        const result = await foodService.fetchFoods(1, 100, {
          restaurant_id: restaurantId,
        });
        console.log("API Response for foods:", result);

        setMenu(result.data || []);
        console.log("Menu set to:", result.data);
      } catch (err) {
        console.error("Failed to load menu:", err);
        showPopup("error", "Failed to load menu items");
      }
    } else {
      console.log("Profile data is not complete:", profile);
    }
  };

  // Handle input changes for both owner and restaurant fields
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev };

      // Create nested structure if it doesn't exist
      if (!newFormData.owner) newFormData.owner = {};
      if (!newFormData.owner.restaurant) newFormData.owner.restaurant = {};

      // Handle special fields
      if (name === "restaurantName") {
        newFormData.owner.restaurant.name = value;
      } else {
        newFormData.owner[name] = value;
      }

      return newFormData;
    });
  };

  const handleEditToggle = (field) => {
    if (editField === field) {
      handleUpdateProfile(field);
    } else {
      setEditField(field);
    }
  };

  const handleUpdateProfile = async (field) => {
    try {
      let updateData = {};

      if (field === "restaurantName") {
        updateData = { name: profile.owner.restaurant.name };
      } else {
        updateData = { [field]: profile.owner[field] };
      }

      const result = await RestoService.updateOwnerProfile(updateData, token);

      // Update local state real-time
      setProfile((prev) => {
        const updated = { ...prev };

        if (field === "restaurantName") {
          updated.owner.restaurant.name = profile.owner.restaurant.name;
        } else {
          updated.owner[field] = profile.owner[field];
        }

        return updated;
      });

      setFormData((prev) => {
        const updated = { ...prev };

        if (field === "restaurantName") {
          updated.owner.restaurant.name = profile.owner.restaurant.name;
        } else {
          updated.owner[field] = profile.owner[field];
        }

        return updated;
      });

      setEditField(null);
      showPopup("success", `Profile updated: ${result.message || "Success"}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      showPopup(
        "error",
        err?.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleProfilePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // File size validation (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showPopup("error", "Photo size must be less than 2MB");
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
      showPopup("error", "Please select a photo to upload");
      return;
    }

    try {
      // Use the UploadService instead of RestoService
      const result = await uploadRestaurantPhoto(profilePhoto, token);

      if (result && result.message) {
        showPopup("success", "Restaurant photo updated successfully");

        // Update local state with new photo URL if returned by API
        if (result.photo) {
          setProfile((prev) => ({
            ...prev,
            owner: {
              ...prev.owner,
              restaurant: {
                ...prev.owner.restaurant,
                photo: result.photo,
              },
            },
          }));
        } else {
          // If no photo URL is returned, refresh the profile to get the latest data
          const updatedProfile = await RestoService.getOwnerProfile(token);
          setProfile(updatedProfile);
        }

        // Reset file input and state
        setProfilePhoto(null);
        if (profilePhotoRef.current) {
          profilePhotoRef.current.value = "";
        }
      }
    } catch (err) {
      console.error("Error updating restaurant photo:", err);

      // More detailed error logging
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }

      showPopup("error", err?.message || "Failed to update restaurant photo");
    }
  };

  const handleFoodPhotoChange = (e) => {
    setFoodPhoto(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Popup message function
  const showPopup = (type, msg) => {
    setPopup({
      show: true,
      type: type,
      message: msg,
    });
  };

  const validateFoodData = () => {
    const missingFields = [];
    if (!foodData.name) missingFields.push("Food Name");
    if (!foodData.type) missingFields.push("Food Type");
    if (!foodData.price) missingFields.push("Price");
    if (!foodData.quantity) missingFields.push("Quantity");
    if (!foodIdToUpdate && !foodPhoto) missingFields.push("Food Photo");

    if (missingFields.length > 0) {
      showPopup(
        "error",
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleAddFoodClick = (e) => {
    e.preventDefault();
    if (validateFoodData()) {
      setConfirmAction({
        show: true,
        type: "add",
        message: `Are you sure you want to add "${foodData.name}" to the menu?`,
        onConfirm: handleAddFood,
      });
    }
  };

  const handleAddFood = async () => {
    try {
      // Check for restaurant ID
      if (!profile?.owner?.restaurant?.id) {
        showPopup(
          "error",
          "Restaurant ID not found. Please make sure your profile is loaded."
        );
        return;
      }

      // Prepare food data
      const foodDataToSend = {
        name: foodData.name,
        type: foodData.type,
        price: parseInt(foodData.price),
        quantity: parseInt(foodData.quantity),
      };

      // Add promoPrice only if it's not empty
      if (foodData.promo_price) {
        foodDataToSend.promo_price = parseInt(foodData.promo_price);
      }

      console.log("Sending food data:", foodDataToSend);
      console.log("With photo:", foodPhoto ? foodPhoto.name : "No photo");

      // Call food service
      const response = await foodService.addFood(foodDataToSend, foodPhoto);
      console.log("Server response:", response);

      if (response && response.food) {
        showPopup("success", `${foodData.name} successfully added to menu!`);

        // Reset form
        setFoodData({
          name: "",
          type: "",
          price: "",
          promo_price: "",
          quantity: "",
        });
        setFoodPhoto(null);
        resetFileInput();

        // Refresh menu
        await loadMenu();
      } else {
        showPopup("error", "Error adding food: Unexpected response");
      }
    } catch (error) {
      console.error("Error adding food:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      showPopup(
        "error",
        error?.response?.data?.message || "Failed to add food. Server error."
      );
    }
  };

  const handleUpdateFoodClick = (e) => {
    e.preventDefault();
    if (validateFoodData()) {
      setConfirmAction({
        show: true,
        type: "update",
        message: `Are you sure you want to update "${foodData.name}"?`,
        onConfirm: handleUpdateFood,
      });
    }
  };

  const handleUpdateFood = async () => {
    try {
      // Prepare food data
      const foodDataToSend = {
        name: foodData.name,
        type: foodData.type,
        price: parseFloat(foodData.price),
        quantity: parseInt(foodData.quantity),
      };

      // Add promoPrice only if it's not empty
      if (foodData.promo_price) {
        foodDataToSend.promo_price = parseFloat(foodData.promo_price);
      }

      // Send to server
      const result = await foodService.updateFood(
        foodIdToUpdate,
        foodDataToSend,
        photo
      );

      showPopup("success", `Food updated: ${result.message || "Success"}`);
      setFoodData({
        name: "",
        type: "",
        price: "",
        promo_price: "",
        quantity: "",
      });
      setPhoto(null);
      setFoodIdToUpdate(null);
      resetFileInput();

      // Refresh menu
      await loadMenu();
    } catch (err) {
      console.error("Error updating food:", err);

      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }

      showPopup(
        "error",
        err?.response?.data?.message || "Failed to update food"
      );
    }
  };

  const handleDeleteFoodClick = (foodId, foodName) => {
    setConfirmAction({
      show: true,
      type: "delete",
      message: `Are you sure you want to delete "${foodName}" from the menu?`,
      onConfirm: () => handleDeleteFood(foodId),
    });
  };

  const handleDeleteFood = async (foodId) => {
    try {
      const result = await foodService.deleteFood(foodId);
      showPopup("success", `Food deleted: ${result.message || "Success"}`);

      // Refresh menu
      await loadMenu();
    } catch (err) {
      console.error("Error deleting food:", err);

      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }

      showPopup(
        "error",
        err?.response?.data?.message || "Failed to delete food"
      );
    }
  };

  const handleConfirmLogout = () => {
    setConfirmAction({
      show: true,
      type: "logout",
      message: "Are you sure you want to sign out?",
      onConfirm: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role"); // Remove role also
        window.location.href = "/";
      },
    });
  };

  const handleEditFood = (food) => {
    // Debug: Check the actual structure of the food object
    console.log("Food object for editing:", food);
    console.log("promo_price value:", food.promo_price);
    console.log("promoPrice value:", food.promoPrice);

    setFoodIdToUpdate(food.id);
    setFoodData({
      name: food.name,
      type: food.type,
      price: food.price,
      // Check both possible field names for promo price
      promo_price: food.promo_price || food.promoPrice || "",
      quantity: food.quantity,
    });

    addFoodRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset file input after submit
  const resetFileInput = () => {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = "";
    });
  };

  // Function to trigger profile photo file input
  const triggerProfilePhotoUpload = () => {
    if (profilePhotoRef.current) {
      profilePhotoRef.current.click();
    }
  };

  // Render a form field with editable capability
  const renderField = (label, fieldPath, isRestaurantField = false) => {
    // Extract field name for editField state management
    const fieldName = fieldPath.split(".").pop();

    // Different value handling for owner vs restaurant fields
    const getValue = () => {
      if (isRestaurantField) {
        return profile?.owner?.restaurant?.[fieldName] || "";
      }
      return profile?.owner?.[fieldName] || "";
    };

    const getFormValue = () => {
      if (isRestaurantField) {
        return formData?.owner?.restaurant?.[fieldName] || "";
      }
      return formData?.owner?.[fieldName] || "";
    };

    // Input name based on field type
    const inputName = isRestaurantField ? "restaurantName" : fieldName;

    return (
      <div className="py-3">
        <label className="text-gray-600 font-semibold block mb-1">
          {label}
        </label>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {editField === fieldName ? (
              <input
                name={inputName}
                value={getFormValue()}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
              />
            ) : (
              <p className="text-lg text-gray-900">{getValue() || "Not set"}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleEditToggle(fieldName)}
            className="ml-4 text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            {editField === fieldName ? (
              <Check size={20} />
            ) : (
              <Pencil size={20} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white space-y-8">
      {/* Profile Section */}
      {profile && profile.owner ? (
        <div className="w-full flex justify-center items-start my-10 px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl pb-8 flex flex-col items-center">
            <div className="relative mt-8">
              <img
                id="profile-preview"
                src={
                  profile.owner.restaurant.photo ||
                  "https://via.placeholder.com/150"
                }
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
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Upload New Photo
              </button>
            )}

            <div className="w-full mt-8 px-6">
              <form className="space-y-4">
                {/* Restaurant Name */}
                {renderField("Restaurant Name", "owner.restaurant.name")}

                {/* Email */}
                {renderField("Email", "owner.email")}

                {/* Phone */}
                {renderField("Phone", "owner.phone")}

                {/* Address */}
                {renderField("Address", "owner.address")}

                {/* Rating - Read Only */}
                <div className="py-3">
                  <label className="text-gray-600 font-semibold block mb-1">
                    Rating
                  </label>
                  <p className="text-lg text-gray-900">
                    {profile.owner.restaurant.rating || "0"}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading profile...</div>
      )}

      {/* Debug Info for Restaurant ID */}
      <div className="text-sm text-gray-500 mb-4">
        Restaurant ID: {profile?.owner?.restaurant?.id || "Not available"}
      </div>

      {/* Add/Edit Food Section */}
      <div
        ref={addFoodRef}
        className="bg-gray-50 p-6 rounded-lg border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {foodIdToUpdate ? "Edit Food" : "Add Food"}
        </h2>
        <form
          onSubmit={foodIdToUpdate ? handleUpdateFoodClick : handleAddFoodClick}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Food Name"
                value={foodData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Type
              </label>
              <input
                type="text"
                name="type"
                placeholder="Food Type"
                value={foodData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={foodData.price}
                onChange={handleInputChange}
                onInput={(e) => (e.target.value = Math.max(0, e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                required
                min="0"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={isPromoDisabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsPromoDisabled(checked);
                    if (checked) {
                      setFoodData((prevData) => ({
                        ...prevData,
                        promo_price: null, // set null saat dicentang
                      }));
                    }
                  }}
                />
                Disable Promo Price
              </label>

              <input
                type="number"
                name="promo_price"
                placeholder="Promo Price (optional)"
                value={isPromoDisabled ? "" : foodData.promo_price || ""}
                onChange={handleInputChange}
                onInput={(e) => (e.target.value = Math.max(0, e.target.value))}
                disabled={isPromoDisabled}
                className={`w-full p-2 border border-gray-300 rounded-lg appearance-none ${
                  isPromoDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={foodData.quantity}
                onChange={handleInputChange}
                onInput={(e) => (e.target.value = Math.max(0, e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Photo
              <span className="ml-2 text-sm text-red-500 font-normal">
                (Photo max size 2mb)
              </span>
            </label>
            <input
              type="file"
              onChange={
                foodIdToUpdate ? handleFileChange : handleFoodPhotoChange
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
              required={!foodIdToUpdate} // Required for new food, optional for update
            />

            {/* Preview for updating food photo */}
            {foodIdToUpdate &&
              menu.find((item) => item.id === foodIdToUpdate)?.photo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Current Photo:</p>
                  <img
                    src={menu.find((item) => item.id === foodIdToUpdate).photo}
                    alt="Current food"
                    className="h-24 w-auto object-cover rounded border border-gray-300"
                  />
                </div>
              )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <button
                type="submit"
                className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
              >
                {foodIdToUpdate ? "Update Food" : "Add Food"}
              </button>
              {foodIdToUpdate && (
                <button
                  type="button"
                  onClick={() => {
                    setFoodIdToUpdate(null);
                    setFoodData({
                      name: "",
                      type: "",
                      price: "",
                      promo_price: "",
                      quantity: "",
                    });
                    setPhoto(null);
                    resetFileInput();
                  }}
                  className="ml-2 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Manage Menu Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Menu</h2>

        {/* Menu Items as Cards */}
        {menu.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No menu items available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {menu.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={
                      food.photo ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">
                    {food.name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {food.type}
                    </p>

                    {/* Updated promo price display with both field name variations */}
                    {(() => {
                      const promoPrice = food.promo_price || food.promoPrice;
                      return promoPrice ? (
                        <p>
                          <span className="line-through text-gray-500 mr-2">
                            Rp {food.price.toLocaleString()}
                          </span>
                          <span className="text-green-700 font-bold">
                            Rp {promoPrice.toLocaleString()}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Price:</span> Rp{" "}
                          {food.price.toLocaleString()}
                        </p>
                      );
                    })()}

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Quantity:</span>{" "}
                      {food.quantity} pcs
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditFood(food)}
                      className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                      title="Edit"
                    >
                      <Edit size={16} className="mr-1" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFoodClick(food.id, food.name)}
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                      title="Delete"
                    >
                      <Trash size={16} className="mr-1" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleConfirmLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Popup modal for success/error messages */}
      {popup.show && (
        <div className="fixed inset-0 bg-gray-600/30 flex justify-center items-center z-50">
          <div
            className={`bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center border ${
              popup.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.type === "success" ? "Success!" : "Error!"}
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

      {/* Confirmation modal */}
      {confirmAction.show && (
        <div className="fixed inset-0 bg-gray-600/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-xl font-medium mb-4">Confirm Action</h3>
            <p className="mb-6">{confirmAction.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setConfirmAction({ ...confirmAction, show: false })
                }
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmAction.onConfirm();
                  setConfirmAction({ ...confirmAction, show: false });
                }}
                className={`px-4 py-2 text-white rounded ${
                  confirmAction.type === "delete" ||
                  confirmAction.type === "logout"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Owner;
