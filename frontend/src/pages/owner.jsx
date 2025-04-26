import React, { useEffect, useState, useRef } from "react";
import { Pencil, Check, Camera, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Owner = () => {
  const [restaurant, setRestaurant] = useState({
    photo: "https://via.placeholder.com/300x200" ,
    name: "Nyisa Restaurant",
    address: "Jl. Raya Jatinangor No.242",
    phone: "081234567890",
    email: "owner@example.com",
    genre: "Western",
  });

  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState(restaurant);
  const [foods, setFoods] = useState([
    { name: "Licensed Bronze Ball", price: 69332, quantity: 21 },
    { name: "Gorgeous Marble Ball", price: 77555, quantity: 36 },
  ]);

  const [newFood, setNewFood] = useState({ name: "", price: "", quantity: "" });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleEditToggle = (field) => {
    if (editField === field) {
      setRestaurant((prev) => ({ ...prev, [field]: form[field] }));
      setEditField(null);
    } else {
      setEditField(field);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setRestaurant((prev) => ({ ...prev, photo: imageUrl }));
    }
  };

  const handleFoodChange = (e) => {
    setNewFood((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addFood = () => {
    if (newFood.name && newFood.price && newFood.quantity) {
      setFoods((prev) => [...prev, { ...newFood, price: Number(newFood.price), quantity: Number(newFood.quantity) }]);
      setNewFood({ name: "", price: "", quantity: "" });
    }
  };

  const renderField = (label, field) => (
    <div className="py-2">
      <label className="text-gray-600 font-semibold">{label}</label>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {editField === field ? (
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-3 py-1 rounded bg-gray-100 text-gray-900"
            />
          ) : (
            <p className="text-lg text-gray-800">{restaurant[field]}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleEditToggle(field)}
          className="ml-3 text-gray-600 hover:text-gray-900"
        >
          {editField === field ? <Check /> : <Pencil />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl p-6">
        {/* Restaurant Photo */}
        <div className="relative flex justify-center mb-6">
          <img
            src={restaurant.photo}
            className="w-full max-w-xl h-60 object-cover rounded-lg"
            alt="Restaurant"
          />
          <button
            type="button"
            onClick={handleImageClick}
            className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
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

        {/* Restaurant Info */}
        <div className="mb-8 space-y-4">
          {renderField("Restaurant Name", "name")}
          {renderField("Address", "address")}
          {renderField("Phone", "phone")}
          {renderField("Email", "email")}
          {renderField("Genre", "genre")}
        </div>

        {/* Manage Menu */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Manage Menu</h2>

          <div className="space-y-4">
            {foods.map((food, index) => (
              <div key={index} className="p-4 border rounded-lg flex justify-between">
                <div>
                  <p className="text-lg font-medium">{food.name}</p>
                  <p className="text-sm text-gray-600">Price: Rp {food.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Quantity: {food.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Food */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Add New Food</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                name="name"
                placeholder="Food name"
                value={newFood.name}
                onChange={handleFoodChange}
                className="p-2 rounded bg-white border"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newFood.price}
                onChange={handleFoodChange}
                className="p-2 rounded bg-white border"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newFood.quantity}
                onChange={handleFoodChange}
                className="p-2 rounded bg-white border"
              />
            </div>
            <button
              onClick={addFood}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" /> Add Food
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;
