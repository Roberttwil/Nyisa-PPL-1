import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [quantities, setQuantities] = useState({}); // quantity default 0

  const fetchFoodData = async (page) => {
    setLoading(true);
    try {
      const data = await FoodService.fetchFoods(page, 15, {
        ...filters,
        restaurant_id: restoId,
      });
      setFoods(data.data);
    } catch (error) {
      console.error("Error fetching food data:", error);
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
    const booking_code = "BOOKING_CODE"; // Ganti dengan nilai sebenarnya
    const user_id = 9; // Ganti dengan nilai sebenarnya

    try {
      const promises = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(async ([food_id, qty]) => {
          const results = [];
          for (let i = 0; i < qty; i++) {
            const response = await OrderService.addToCart(
              booking_code,
              user_id,
              food_id
            );
            results.push(response);
          }
          return results;
        });

      await Promise.all(promises);
      alert("Items added to cart successfully!");
      setQuantities({}); // Reset quantities
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };

  useEffect(() => {
    if (restoId) {
      fetchFoodData(1);
    }
  }, [filters, restoId]);

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
                className="bg-white rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <PostCard
                  image={food.photo}
                  title={food.name}
                  description={
                    <>
                      <p>Type: {food.type}</p>
                      <p>Price: ${food.price}</p>
                      <p>Quantity: {food.quantity}</p>
                    </>
                  }
                />

                {/* Quantity Controls */}
                <div className="flex justify-center items-center gap-4 py-4">
                  <button
                    className="bg-gray-200 text-lg w-6 h-6 rounded-full flex items-center justify-center"
                    onClick={() => handleDecrement(food.id)}
                  >
                    -
                  </button>
                  <span className="font-semibold">
                    {quantities[food.id] || 0}
                  </span>
                  <button
                    className="bg-gray-200 text-lg w-6 h-6 rounded-full flex items-center justify-center"
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
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Add Selected Items to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodList;
