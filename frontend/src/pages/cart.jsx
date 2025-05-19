import React, { useEffect, useState } from "react";
import OrderService from "../services/OrderService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({
    show: false,
    type: 'success', // atau 'error'
    message: '',
  });
  const [confirmModal, setConfirmModal] = useState({
  show: false,
  foodId: null,
  foodName: "",
});

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

      const purchaseHistory = cartItems.map((item) => ({
        name: item.food_name,
        photo: item.food_photo,
        total: item.food_price * item.quantity,
        date: new Date().toLocaleDateString(),
        restaurantId: activeRestoId,
        foodId: item.food_id,
      }));

      const existingHistory = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
      const updatedHistory = [...existingHistory, ...purchaseHistory];
      localStorage.setItem("purchaseHistory", JSON.stringify(updatedHistory));

      setPopup({
        show: true,
        type: 'success',
        message: 'Your order has been successfully booked.',
      });
      setCartItems([]);
    } catch (error) {
      console.error("Failed to book order:", error);
      setPopup({
        show: true,
        type: 'error',
        message: 'Failed to book your order. Please try again later.',
      });
    }
  };


  const total = cartItems.reduce(
    (sum, item) => sum + item.food_price * item.quantity,
    0
  );

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-4 py-8">
      {popup.show && (
          <div className="fixed inset-0 bg-gray-600/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center
              ${popup.type === 'success' ? 'border-green-500' : 'border-red-500'}">
              <h2 className={`text-2xl font-bold mb-4 ${popup.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {popup.type === 'success' ? 'Success!' : 'Error!'}
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

        {confirmModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setConfirmModal({ show: false, foodId: null, foodName: "" })}
            ></div>
            <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center border border-red-500">
              <h2 className="text-xl font-semibold mb-2 text-red-600">Confirm Removal</h2>
              <p className="mb-4">
                Are you sure you want to remove{" "}
                <span className="font-bold">{confirmModal.foodName}</span> from your cart?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setConfirmModal({ show: false, foodId: null, foodName: "" })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={async () => {
                    await handleRemove(confirmModal.foodId);
                    setConfirmModal({ show: false, foodId: null, foodName: "" });
                  }}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

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
            <p className="text-gray-600 text-center">Your cart is empty. Please add items to your cart.</p>
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
                  <p className="mt-2">Unit Price: Rp {item.food_price?.toLocaleString("id-ID")}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="flex justify-between items-center p-4">
                  <button
                    onClick={() =>
                    setConfirmModal({
                      show: true,
                      foodId: item.food_id,
                      foodName: item.food_name,
                    })
                  }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
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
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
