import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FoodService from "../services/FoodService";
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
  const [userRole, setUserRole] = useState("user"); // Default to user role
  const navigate = useNavigate();

  const fetchFoodData = async (page, token) => {
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
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to add items to the cart.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Ambil booking code untuk restoran ini
      const allCodes = JSON.parse(localStorage.getItem("bookingCodesPerResto")) || {};
      const userBookingCodes = JSON.parse(localStorage.getItem("userBookingCodes")) || {};
      const userBookingCode = userBookingCodes[userId]?.[restoId];

      if (!userBookingCode) {
        alert("Booking code not found for this restaurant. Please refresh the page.");
        return;
      }

      const itemsToAdd = Object.entries(quantities).filter(
        ([_, qty]) => qty > 0
      );

      for (const [foodId, quantity] of itemsToAdd) {
        await OrderService.addToCart({
          booking_code: userBookingCode,
          food_id: parseInt(foodId),
          user_id: parseInt(userId),
          quantity: parseInt(quantity),
        });
      }

      alert("All items have been successfully added to the cart!");
    } catch (error) {
      console.error("Failed to add items to the cart:", error);
      alert("An error occurred while adding items to the cart.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingCode = async () => {
    const userId = localStorage.getItem("user_id");
    const allCodes = JSON.parse(localStorage.getItem("bookingCodesPerResto")) || {};
    const userBookingCodes = JSON.parse(localStorage.getItem("userBookingCodes")) || {};

    if (!userBookingCodes[userId]) {
      userBookingCodes[userId] = {};
    }

    if (!userBookingCodes[userId][restoId]) {
      try {
        const response = await OrderService.generateBookingCode();
        const bookingCode = response.bookingCode;
        userBookingCodes[userId][restoId] = bookingCode;
        localStorage.setItem("userBookingCodes", JSON.stringify(userBookingCodes));
        console.log("Generated new booking code for user:", userId, "restaurant:", restoId, bookingCode);
      } catch (error) {
        console.error("Failed to generate booking code:", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    
    // Set user role from localStorage
    if (storedRole) {
      setUserRole(storedRole);
    }

    // Simpan restoId aktif untuk digunakan di Cart
    if (restoId) {
      localStorage.setItem("activeRestoId", restoId);
    }

    // Only fetch booking code if user role is not restaurant
    if (userRole !== "restaurant") {
      fetchBookingCode();
    }

    if (restoId) {
      fetchFoodData(1, token);
    }
  }, [filters, restoId, navigate, userRole]);

  const hasItems = Object.values(quantities).some((qty) => qty > 0);
  const isUserRole = userRole !== "restaurant";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32 relative">
      <h1 className="text-2xl font-bold mb-6">Food List</h1>

      <div className="mb-6">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search by name"
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg"
        />
      </div>

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
                <img
                  src={food.photo}
                  alt={food.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold truncate">{food.name}</h2>
                <div className="text-sm mt-2 space-y-1">
                  <p>Type: {food.type}</p>
                  <p>Price: Rp{food.price}</p>
                  <p>Quantity: {food.quantity}</p>
                </div>
                
                {/* Only show quantity controls for users with role 'user' */}
                {isUserRole && (
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
                )}
              </div>
            ))
          ) : (
            <p>No food found for this restaurant</p>
          )}
        </div>
      )}

      {/* Only show "Add to Cart" button for users with role 'user' */}
      {isUserRole && hasItems && (
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