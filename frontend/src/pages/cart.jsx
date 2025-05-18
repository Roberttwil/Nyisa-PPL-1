import React, { useEffect, useState } from "react";
import OrderService from "../services/OrderService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("user_id");
  const activeRestoId = localStorage.getItem("activeRestoId");
  const userBookingCodes =
    JSON.parse(localStorage.getItem("userBookingCodes")) || {};
  const bookingCode = userBookingCodes[userId]?.[activeRestoId];

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!bookingCode) {
          throw new Error(
            "Booking code not found for this restaurant and user."
          );
        }

        // Fetch cart based on the user's booking code
        const data = await OrderService.getCart(bookingCode);
        console.log("Cart API response:", data);

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.cart)
            ? data.cart
            : null;

        if (!items) {
          throw new Error("Invalid cart data.");
        }

        // Grouping items with the same food_id
        const groupedItems = items.reduce((acc, item) => {
          const existingItem = acc.find((i) => i.food_id === item.food_id);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            acc.push({ ...item });
          }
          return acc;
        }, []);

        setCartItems(groupedItems);
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
        setError(error.message);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [bookingCode]);

  const handleRemove = async (food_id) => {
    try {
      await OrderService.removeFromCart(bookingCode, food_id);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.food_id !== food_id)
      );
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const handleBooking = async () => {
    try {
      await OrderService.bookOrder(bookingCode);

      // Save purchase history to localStorage with restaurant ID and other details
      const purchaseHistory = cartItems.map((item) => ({
        name: item.food_name,
        photo: item.food_photo,
        total: (item.promo_price ?? item.food_price) * item.quantity,
        date: new Date().toLocaleDateString(),
        restaurantId: activeRestoId, // Storing the restaurant ID
        foodId: item.food_id,       // Storing the food ID
      }));

      // Get existing history from localStorage
      const existingHistory = JSON.parse(localStorage.getItem("purchaseHistory")) || [];

      // Add new history to existing data
      const updatedHistory = [...existingHistory, ...purchaseHistory];

      // Store the updated history
      localStorage.setItem("purchaseHistory", JSON.stringify(updatedHistory));

      alert("Order booked successfully!");
      setCartItems([]);
    } catch (error) {
      console.error("Failed to book order:", error);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const effectivePrice = item.promo_price ?? item.food_price;
    return sum + effectivePrice * item.quantity;
  }, 0);


  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between w-full mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        {cartItems.length > 0 && (
          <p className="mt-3 font-bold text-2xl text-gray-700">
            Booking Code: <span className="text-blue-600">{bookingCode}</span>
          </p>
        )}
      </div>

      {/* Cart Items or Empty State */}
      <div className="flex flex-grow flex-col">
        {cartItems.length === 0 ? (
          <div>
            <p className="text-gray-600">Your cart is empty. Please add items to your cart.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartItems.map((item) => (
              <div
                key={`${item.food_id}-${item.quantity}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{item.food_name}</h3>
                  <img
                    src={item.food_photo}
                    alt={item.food_name}
                    className="w-full h-40 object-cover rounded-lg mt-2"
                  />
                  <p className="mt-2 text-sm font-medium">
                    Unit Price:{" "}
                    {item.promo_price ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          Rp {item.food_price?.toLocaleString("id-ID")}
                        </span>
                        <span className="text-green-700">
                          Rp {item.promo_price?.toLocaleString("id-ID")}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold ">
                        Rp {item.food_price?.toLocaleString("id-ID")}
                      </span>
                    )}
                  </p>
                  <p className="font-medium text-sm">Quantity: {item.quantity}</p>
                </div>
                <div className="flex justify-between items-center p-4">
                  <button
                    onClick={() => handleRemove(item.food_id)}
                    className="bg-red-500 text-white px-4 font-medium py-2 rounded-lg hover:bg-red-600 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total and Booking Button */}
      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <h3 className="text-xl font-bold">Total: Rp {total.toLocaleString("id-ID")}</h3>
          <button
            onClick={handleBooking}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 cursor-pointer font-medium"
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
