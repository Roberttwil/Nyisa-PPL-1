import React, { useEffect, useState } from "react";
import { Edit, Trash, Camera, Check, Pencil } from "lucide-react";
import foodService from "../services/FoodService";
import RestoService from "../services/RestoService";

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
  const [menu, setMenu] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    restaurantName: "",
    rating: 0,
    photo: "",
  });
  const [editField, setEditField] = useState(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Load Owner Profile on Mount by username
  useEffect(() => {
    const fetchProfile = async () => {
      if (username && token) {
        try {
          const result = await RestoService.getOwnerProfile(token);
          setProfile(result);
          console.log("Fetched profile:", result); // Cek data profil
        } catch (err) {
          console.error("Failed to load owner profile:", err);
          setMessage("Failed to load owner profile");
        }
      } else {
        setMessage("Username or token not found");
      }
    };
    fetchProfile();
  }, [token, username]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    // Jika yang diubah adalah field 'restaurant.name'
    if (name === "restaurantName") {
      setProfile((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          restaurant: {
            ...prev.owner.restaurant,
            name: value, // Update nama restoran
          },
        },
      }));
    }
    // Jika yang diubah adalah field 'owner.name'
    else if (name === "ownerName") {
      setProfile((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          name: value, // Update nama pemilik
        },
      }));
    }
    // Jika yang diubah adalah field lain di dalam 'owner'
    else if (name in profile.owner) {
      setProfile((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          [name]: value, // Update field owner lain
        },
      }));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { rating, ...updateData } = profile.owner;
      // Kirim data update ke backend (misalnya dengan PUT)
      const result = await RestoService.updateOwnerProfile(updateData, token);
      setMessage(`Profile updated: ${result.message}`);
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Failed to update profile");
    }
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

  const handleAddFood = async (e) => {
    e.preventDefault(); // Hindari reload halaman

    console.log("Sending foodData:", foodData);
    console.log("Sending photo:", foodPhoto);

    try {
      const response = await foodService.addFood(foodData, foodPhoto || null); // Kirim null jika foto kosong

      if (response?.food) {
        console.log("Food added successfully:", response.food);
        setFoodData({ name: "", type: "", price: "", quantity: "" });
        setFoodPhoto(null);
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      console.error(
        "Error adding food:",
        error?.response?.data || error.message
      );
      if (error?.response?.data) {
        alert(`Error: ${error.response.data.message || "Failed to add food"}`);
      } else {
        alert("Unexpected error occurred.");
      }
    }
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    try {
      const result = await foodService.updateFood(
        foodIdToUpdate,
        foodData,
        photo
      );
      setMessage(`Food updated: ${result.message}`);
      setFoodData({ name: "", type: "", price: "", quantity: "" });
      setPhoto(null);
      setMenu((prevMenu) =>
        prevMenu.map((food) =>
          food.id === foodIdToUpdate ? { ...food, ...foodData } : food
        )
      );
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Error updating food:", err);
      setMessage("Failed to update food");
    }
  };

  const handleDeleteFood = async (foodId) => {
    try {
      const result = await foodService.deleteFood(foodId);
      setMessage(`Food deleted: ${result.message}`);
      setMenu((prevMenu) => prevMenu.filter((food) => food.id !== foodId));
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Error deleting food:", err);
      setMessage("Failed to delete food");
    }
  };

  const handleEditToggle = (field) => {
    if (editField === field) {
      // Simpan perubahan ke state saat Check ditekan
      const updatedData = { ...profile.owner };
      updatedData[field] = profile.owner[field]; // Update sesuai dengan field yang diubah
      setProfile({
        ...profile,
        owner: updatedData,
      });
      // Kirim ke backend
      handleUpdateProfile();
      setEditField(null); // Reset status edit setelah update
    } else {
      setEditField(field); // Aktifkan mode edit
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white space-y-8">
      {/* Profile Section */}
      {profile && profile.owner ? (
        <div className="w-full flex justify-center items-start my-10 px-4">
          <div className="w-full max-w-3xl bg-white rounded-xl pb-8 flex flex-col items-center">
            <div className="relative mt-8">
              <img
                src={
                  profile.owner.restaurant.photo ||
                  "https://via.placeholder.com/150"
                }
                className="rounded-full w-40 h-40 object-cover bg-black"
                alt="Profile"
              />
              <button
                type="button"
                onClick={() => {}}
                className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
              >
                <Camera className="w-5 h-5 text-gray-700 cursor-pointer" />
              </button>
            </div>
            <div className="w-full mt-8 px-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Owner Name */}
                <div className="py-3">
                  <label className="text-gray-600 font-semibold block mb-1">
                    Owner Name
                  </label>
                  <div className="flex items-center">
                    {editField === "ownerName" ? (
                      <input
                        name="ownerName"
                        value={profile.owner.name}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 w-full">
                        {profile.owner.name}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditToggle("ownerName")}
                      className="ml-2 text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                      {editField === "ownerName" ? (
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
                          value={profile.owner.email}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                        />
                      ) : (
                        <p className="text-lg text-gray-900 w-full">
                          {profile.owner.email}
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
                        value={profile.owner.restaurant.name}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 w-full">
                        {profile.owner.restaurant.name}
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
                          value={profile.owner.phone}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                        />
                      ) : (
                        <p className="text-lg text-gray-900 w-full">
                          {profile.owner.phone}
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
                          value={profile.owner.address}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 rounded bg-gray-100 text-gray-900"
                        />
                      ) : (
                        <p className="text-lg text-gray-900 w-full">
                          {profile.owner.address}
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

                {/* Rating */}
                <div className="py-3">
                  <label className="text-gray-600 font-semibold block mb-1">
                    Rating
                  </label>
                  <p className="text-lg text-gray-900">
                    {profile.owner.restaurant.rating}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading profile...</div>
      )}

      {/* Manage Menu */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Menu</h2>
        <div className="space-y-4">
          {menu.length === 0 ? (
            <p>No food items available.</p>
          ) : (
            menu.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex space-x-4">
                  <span>{food.name}</span>
                  <span>{food.price}</span>
                  <span>{food.quantity}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFoodIdToUpdate(food.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Food */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add Food</h2>
        <form onSubmit={handleAddFood} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Food Name"
              value={foodData.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="type"
              placeholder="Food Type"
              value={foodData.type}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={foodData.price}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={foodData.quantity}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <div className="mt-4 flex justify-between items-center">
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
            >
              Add Food
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>

      {/* Message Display */}
      {message && (
        <div className="text-center text-green-500 mt-4">{message}</div>
      )}
    </div>
  );
};

export default Owner;
