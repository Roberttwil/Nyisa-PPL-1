import React, { useState } from "react";
import { Edit, Trash } from "lucide-react"; // Import ikon dari lucide-react
import foodService from "../services/FoodService"; // Assuming FoodService is in the same directory

const Owner = () => {
  const [foodData, setFoodData] = useState({
    name: "",
    type: "",
    price: "",
    quantity: "",
  });
  const [foodIdToUpdate, setFoodIdToUpdate] = useState("");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [menu, setMenu] = useState([]); // Untuk menyimpan daftar menu makanan

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change (for photo)
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const foodWithRestaurant = {
        ...foodData,
        restaurantId: 23, // Tetapkan restaurantId di sini
      };
  
      const result = await foodService.addFood(foodWithRestaurant, photo);
      setMessage(`Food added: ${result.message}`);
      setFoodData({ name: "", type: "", price: "", quantity: "" });
      setPhoto(null);
      setMenu((prevMenu) => [...prevMenu, result.food]);
    } catch (err) {
      console.error("Error adding food:", err);
      setMessage("Failed to add food");
    }
  };
  

  // Update food handler
  const handleUpdateFood = async (e) => {
    e.preventDefault();
    try {
      const result = await foodService.updateFood(
        foodIdToUpdate,
        foodData,
        photo
      );
      setMessage(`Food updated: ${result.message}`);
      setFoodData({ name: "", type: "", price: "", quantity: "" }); // Reset form
      setPhoto(null); // Reset photo
      setMenu((prevMenu) =>
        prevMenu.map((food) =>
          food.id === foodIdToUpdate ? { ...food, ...foodData } : food
        )
      ); // Update food in menu
    } catch (err) {
      console.error("Error updating food:", err);
      setMessage("Failed to update food");
    }
  };

  // Delete food handler
  const handleDeleteFood = async (foodId) => {
    try {
      const result = await foodService.deleteFood(foodId);
      setMessage(`Food deleted: ${result.message}`);
      setMenu((prevMenu) => prevMenu.filter((food) => food.id !== foodId)); // Remove food from menu
    } catch (err) {
      console.error("Error deleting food:", err);
      setMessage("Failed to delete food");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Owner Dashboard
      </h1>

      <div className="space-y-8">
        {/* Manage Menu Section */}
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

        {/* Add Food Section */}
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
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="type"
                placeholder="Food Type"
                value={foodData.type}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={foodData.price}
                onChange={handleInputChange}
                className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
             p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={foodData.quantity}
                onChange={handleInputChange}
                className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
             p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex justify-start">
              <button
                type="submit"
                className="w-full sm:w-auto py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none cursor-pointer"
              >
                Add Food
              </button>
            </div>
          </form>
        </div>
      </div>

      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
};

export default Owner;
