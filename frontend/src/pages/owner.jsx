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
    quantity: "",
  });
  const [foodPhoto, setFoodPhoto] = useState(null);
  const [foodIdToUpdate, setFoodIdToUpdate] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [menu, setMenu] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    restaurantName: "",
    rating: 0,
    photo: "",
  });
  const [editField, setEditField] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const profilePhotoRef = useRef(null);
  const addFoodRef = useRef(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Load Owner Profile on Mount by username
  useEffect(() => {
    const fetchProfile = async () => {
      if (username && token) {
        try {
          const result = await RestoService.getOwnerProfile(token);
          setProfile(result);
          console.log("Fetched profile:", result);
        } catch (err) {
          console.error("Failed to load owner profile:", err);
          showError("Failed to load owner profile");
        }
      } else {
        showError("Username or token not found");
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
        showError("Failed to load menu items");
      }
    } else {
      console.log("Profile data is not complete:", profile);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    // If changing restaurant name
    if (name === "restaurantName") {
      setProfile((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          restaurant: {
            ...prev.owner.restaurant,
            name: value,
          },
        },
      }));
    }
    // If changing owner name
    else if (name === "ownerName") {
      setProfile((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          name: value,
        },
      }));
    }
    // If changing other owner fields
    else if (name in profile.owner) {
      setProfile((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          [name]: value,
        },
      }));
    }
  };

  const handleProfilePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // File size validation (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showError("Photo size must be less than 2MB");
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
      showError("Please select a photo to upload");
      return;
    }

    try {
      // Use the UploadService instead of RestoService
      const result = await uploadRestaurantPhoto(profilePhoto, token);

      if (result && result.message) {
        showSuccess("Restaurant photo updated successfully");

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

      showError(err?.message || "Failed to update restaurant photo");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { restaurant, ...ownerData } = profile.owner;

      // Prepare data for update
      const updateData = {
        ...ownerData,
        restaurantName: restaurant.name,
      };

      // Send update to backend
      const result = await RestoService.updateOwnerProfile(updateData, token);
      showSuccess(`Profile updated: ${result.message || "Success"}`);

      // Reset edit field
      setEditField(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      showError(err?.response?.data?.message || "Failed to update profile");
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

  // Success message function
  const showSuccess = (msg) => {
    setMessage(msg);
    setErrorMessage("");
    setTimeout(() => setMessage(""), 5000);
  };

  // Error message function
  const showError = (msg) => {
    setErrorMessage(msg);
    setMessage("");
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    // Reset messages
    setMessage("");
    setErrorMessage("");

    // Validate input
    const missingFields = [];
    if (!foodData.name) missingFields.push("Food Name");
    if (!foodData.type) missingFields.push("Food Type");
    if (!foodData.price) missingFields.push("Price");
    if (!foodData.quantity) missingFields.push("Quantity");
    if (!foodPhoto) missingFields.push("Food Photo");

    if (missingFields.length > 0) {
      showError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      // Check for restaurant ID
      if (!profile?.owner?.restaurant?.id) {
        showError(
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

      console.log("Sending food data:", foodDataToSend);
      console.log("With photo:", foodPhoto ? foodPhoto.name : "No photo");

      // Call food service
      const response = await foodService.addFood(foodDataToSend, foodPhoto);
      console.log("Server response:", response);

      if (response && response.food) {
        showSuccess(`${foodData.name} successfully added to menu!`);

        // Reset form
        setFoodData({ name: "", type: "", price: "", quantity: "" });
        setFoodPhoto(null);
        resetFileInput();

        // Refresh menu
        await loadMenu();
      } else {
        showError("Error adding food: Unexpected response");
      }
    } catch (error) {
      console.error("Error adding food:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      showError(
        error?.response?.data?.message || "Failed to add food. Server error."
      );
    }
  };

  const handleUpdateFoodWithConfirmation = (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to update this food?"
    );
    if (confirmed) {
      handleUpdateFood(e);
    }
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();

    // Validate input
    const missingFields = [];
    if (!foodData.name) missingFields.push("Food Name");
    if (!foodData.type) missingFields.push("Food Type");
    if (!foodData.price) missingFields.push("Price");
    if (!foodData.quantity) missingFields.push("Quantity");

    if (missingFields.length > 0) {
      showError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      // Prepare food data
      const foodDataToSend = {
        name: foodData.name,
        type: foodData.type,
        price: parseFloat(foodData.price),
        quantity: parseInt(foodData.quantity),
      };

      // Send to server
      const result = await foodService.updateFood(
        foodIdToUpdate,
        foodDataToSend,
        photo
      );

      showSuccess(`Food updated: ${result.message || "Success"}`);
      setFoodData({ name: "", type: "", price: "", quantity: "" });
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

      showError(err?.response?.data?.message || "Failed to update food");
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const result = await foodService.deleteFood(foodId);
        showSuccess(`Food deleted: ${result.message || "Success"}`);

        // Refresh menu
        await loadMenu();
      } catch (err) {
        console.error("Error deleting food:", err);

        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }

        showError(err?.response?.data?.message || "Failed to delete food");
      }
    }
  };

  const handleEditFood = (food) => {
    setFoodIdToUpdate(food.id);
    setFoodData({
      name: food.name,
      type: food.type,
      price: food.price,
      quantity: food.quantity,
    });

    addFoodRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEditToggle = (field) => {
    if (editField === field) {
      // Save changes when Check is pressed
      handleUpdateProfile();
    } else {
      setEditField(field); // Activate edit mode
    }
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white space-y-8">
      {/* Success Alert */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

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
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Upload New Photo
              </button>
            )}

            <div className="w-full mt-8 px-6">
              <form className="space-y-4">
                {/* Owner Name */}
                <div className="py-3">
                  <label className="text-gray-600 font-semibold block mb-1">
                    Owner Name
                  </label>
                  <div className="flex items-center">
                    {editField === "name" ? (
                      <input
                        name="name"
                        value={profile.owner.name || ""}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 w-full">
                        {profile.owner.name || "Not set"}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditToggle("name")}
                      className="ml-2 text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                      {editField === "name" ? (
                        <Check size={20} />
                      ) : (
                        <Pencil size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="py-3 flex items-center justify-between">
                  <div className="w-full">
                    <label className="text-gray-600 font-semibold block mb-1">
                      Email
                    </label>
                    <div className="flex items-center">
                      {editField === "email" ? (
                        <input
                          name="email"
                          value={profile.owner.email || ""}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                        />
                      ) : (
                        <p className="text-lg text-gray-900 w-full">
                          {profile.owner.email || "Not set"}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleEditToggle("email")}
                        className="ml-4 text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        {editField === "email" ? (
                          <Check size={20} />
                        ) : (
                          <Pencil size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Restaurant Name */}
                <div className="py-3">
                  <label className="text-gray-600 font-semibold block mb-1">
                    Restaurant Name
                  </label>
                  <div className="flex items-center">
                    {editField === "restaurantName" ? (
                      <input
                        name="restaurantName"
                        value={profile.owner.restaurant.name || ""}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 w-full">
                        {profile.owner.restaurant.name || "Not set"}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditToggle("restaurantName")}
                      className="ml-2 text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                      {editField === "restaurantName" ? (
                        <Check size={20} />
                      ) : (
                        <Pencil size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="py-3 flex items-center justify-between">
                  <div className="w-full">
                    <label className="text-gray-600 font-semibold block mb-1">
                      Phone
                    </label>
                    <div className="flex items-center">
                      {editField === "phone" ? (
                        <input
                          name="phone"
                          value={profile.owner.phone || ""}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                        />
                      ) : (
                        <p className="text-lg text-gray-900 w-full">
                          {profile.owner.phone || "Not set"}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleEditToggle("phone")}
                        className="ml-4 text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        {editField === "phone" ? (
                          <Check size={20} />
                        ) : (
                          <Pencil size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="py-3 flex items-center justify-between">
                  <div className="w-full">
                    <label className="text-gray-600 font-semibold block mb-1">
                      Address
                    </label>
                    <div className="flex items-center">
                      {editField === "address" ? (
                        <input
                          name="address"
                          value={profile.owner.address || ""}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                        />
                      ) : (
                        <p className="text-lg text-gray-900 w-full">
                          {profile.owner.address || "Not set"}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleEditToggle("address")}
                        className="ml-4 text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        {editField === "address" ? (
                          <Check size={20} />
                        ) : (
                          <Pencil size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

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
          onSubmit={foodIdToUpdate ? handleUpdateFoodWithConfirmation : handleAddFood}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
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
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
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
        <div className="flex justify-between items-center mb-4">
          <span>{menu.length} items found</span>
          <button
            onClick={loadMenu}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Menu
          </button>
        </div>

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
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Price:</span> Rp{" "}
                      {food.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Quantity:</span>{" "}
                      {food.quantity} pcs
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditFood(food)}
                      className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                      title="Edit"
                    >
                      <Edit size={16} className="mr-1" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFood(food.id)}
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
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Owner;
