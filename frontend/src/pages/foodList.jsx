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
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
  
    console.log("Booking Code from localStorage:", bookingCode);
    console.log("User ID from localStorage:", userId);
    console.log("Token from localStorage:", token); // Pastikan token tersedia
  
    if (!bookingCode) {
      alert(
        "Booking code tidak ditemukan. Silakan login dan mulai order terlebih dahulu."
      );
      return;
    }
  
    try {
      setLoading(true);
  
      const itemsToAdd = Object.entries(quantities).filter(
        ([_, qty]) => qty > 0
      );
  
      for (const [foodId, quantity] of itemsToAdd) {
        console.log("Adding food item:", foodId);  // Memastikan foodId ada pada setiap iterasi
  
        for (let i = 0; i < quantity; i++) {
          // Pastikan untuk menambahkan token di header saat melakukan permintaan
          await OrderService.addToCart({
            booking_code: bookingCode,
            food_id: parseInt(foodId),
            user_id: parseInt(userId),
          });
  
          console.log(`Added foodId: ${foodId}, Quantity: ${quantity}`);
        }
      }
  
      alert("Semua item berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
      alert("Terjadi kesalahan saat menambahkan item ke keranjang.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

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
