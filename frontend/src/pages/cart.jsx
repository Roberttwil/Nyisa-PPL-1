import React, { useEffect, useState } from "react";
import OrderService from "../services/OrderService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil semua kode pemesanan yang ada di localStorage
  const allBookingCodes =
    JSON.parse(localStorage.getItem("bookingCodes")) || [];
  const bookingCode = allBookingCodes[allBookingCodes.length - 1]; // Ambil booking code yang terbaru

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!bookingCode) {
          throw new Error("Booking code tidak ditemukan");
        }

        // Ambil data keranjang berdasarkan bookingCode
        const data = await OrderService.getCart(bookingCode);
        console.log("Cart API response:", data);

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.cart)
          ? data.cart
          : null;

        if (!items) {
          throw new Error("Data cart tidak valid");
        }

        setCartItems(items);
      } catch (error) {
        console.error("Gagal mengambil data cart:", error);
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
      console.error("Gagal menghapus item dari cart:", error);
    }
  };

  const handleBooking = async () => {
    try {
      await OrderService.bookOrder(bookingCode);
      alert("Pemesanan berhasil!");
      setCartItems([]);
    } catch (error) {
      console.error("Gagal melakukan booking:", error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  if (!bookingCode) {
    return (
      <p className="text-red-500">
        Booking code tidak ditemukan. Silakan mulai pemesanan terlebih dahulu.
      </p>
    );
  }

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-row items-center justify-between w-full">
      <h1 className="text-2xl font-bold mb-6 ">Your Cart</h1>
      <p className="mt-3 font-bold text-2xl text-gray-700">
        Booking Code: <span className="text-blue-600">{bookingCode}</span>
      </p>
        
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Cart kosong.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartItems.map((item) => (
              <div
                key={item.food_id || Math.random()}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-4">
                  <h3 className="font-bold text-lg">
                    {item.food_name || "Tanpa nama"}
                  </h3>
                  <img
                    src={item.food_photo || "https://via.placeholder.com/150"}
                    // alt={item.name || 'Gambar tidak tersedia'}
                    className="w-full h-40 object-cover rounded-lg mt-2"
                  />
                  <p className="mt-2">
                    Unit Price: Rp{" "}
                    {item.food_price?.toLocaleString("id-ID") || 0}
                  </p>
                  <p>Quantity: {item.food_quantity || 0}</p>
                </div>
                <div className="flex justify-between items-center p-4">
                  <button
                    onClick={() => handleRemove(item.food_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-xl font-bold">
              Total: Rp {total.toLocaleString("id-ID")}
            </h3>
            <button
              onClick={handleBooking}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Book Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
