import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FoodService from "../services/FoodService";
import PostCard from "../components/postcard";
import OrderService from "../services/OrderService";

const FoodList = () => {
  const { restoId } = useParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  const fetchFoodData = async (page, token) => {
    console.log("Token sent to API:", token);
    setLoading(true);
    try {
      const data = await FoodService.fetchFoods(
        page,
        15,
        {
          ...filters,
          restaurant_id: restoId,
        },
        token
      );
      setFoods(data.data);
    } catch (error) {
      console.error("Error fetching food data:", error);
      if (error.response?.status === 401) {
        alert("Session expired or invalid token. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = (food_id) => {
    setQuantities((prev) => ({ ...prev, [food_id]: (prev[food_id] || 0) + 1 }));
  };

  const handleDecrement = (food_id) => {
    setQuantities((prev) => {
      const currentQty = prev[food_id] || 0;
      return { ...prev, [food_id]: Math.max(currentQty - 1, 0) };
    });
  };

  const handleAddAllToCart = async () => {
    const bookingCode = localStorage.getItem("bookingCode");
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    console.log("Booking Code from localStorage:", bookingCode);
    console.log("User ID from localStorage:", userId);
    console.log("Token from localStorage:", token);

    if (!token) {
      alert("You must be logged in to add items to the cart.");
      navigate("/login");
      return;
    }

    if (!bookingCode) {
      alert("Booking code not found. Please log in and start ordering first.");
      return;
    }

    try {
      setLoading(true);

      const itemsToAdd = Object.entries(quantities).filter(
        ([_, qty]) => qty > 0
      );

      for (const [foodId, quantity] of itemsToAdd) {
        console.log("Adding food item:", foodId);

        for (let i = 0; i < quantity; i++) {
          await OrderService.addToCart({
            booking_code: bookingCode,
            food_id: parseInt(foodId),
            user_id: parseInt(userId),
          });
          console.log(`Added foodId: ${foodId}, Quantity: ${quantity}`);
        }
      }

      alert("All items have been successfully added to the cart!");
    } catch (error) {
      console.error("Failed to add items to the cart:", error);
      alert("An error occurred while adding items to the cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Memastikan booking code di-generate dan disimpan di localStorage
    const bookingCode = localStorage.getItem("bookingCode");
    if (!bookingCode) {
      OrderService.generateBookingCode(); // Panggil fungsi ini untuk generate booking code
    }

    if (restoId) {
      fetchFoodData(1, token);
    }
  }, [filters, restoId, navigate]);

  const hasItems = Object.values(quantities).some((qty) => qty > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32 relative">
      <h1 className="text-2xl font-bold mb-6">Food List</h1>

      {/* Filter/Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search by name"
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Food Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.length > 0 ? (
            foods.map((food) => (
              <div
                key={food.id}
                className="border border-transparent rounded-xl p-4 flex flex-col justify-between bg-white text-black shadow-sm"
              >
                {/* Gambar makanan */}
                <img
                  src={food.photo}
                  alt={food.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />

                {/* Nama makanan */}
                <h2 className="text-lg font-semibold truncate">{food.name}</h2>

                {/* Deskripsi makanan */}
                <div className="text-sm mt-2 space-y-1">
                  <p>Type: {food.type}</p>
                  <p>Price: ${food.price}</p>
                  <p>Quantity: {food.quantity}</p>
                </div>

                {/* Kontrol quantity */}
                <div className="flex justify-center items-center gap-4 py-4 mt-auto">
                  <button
                    className="bg-gray-200 text-lg w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => handleDecrement(food.id)}
                  >
                    -
                  </button>
                  <span className="font-semibold">
                    {quantities[food.id] || 0}
                  </span>
                  <button
                    className="bg-gray-200 text-lg w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => handleIncrement(food.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No food found for this restaurant</p>
          )}
        </div>
      )}

      {hasItems && (
        <div className="sticky bottom-0 bg-white py-4 mt-10 flex justify-center z-20">
          <button
            onClick={handleAddAllToCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition w-[90%] sm:w-auto md:w-full text-center cursor-pointer"
          >
            Add Selected Items to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodList;
