import React, { useState, useEffect } from 'react';
import OrderService from '../services/OrderService'; // Import untuk OrderService
// import { useHistory } from 'react-router-dom'; // Untuk navigasi setelah booking

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    // const history = useHistory();

    useEffect(() => {
        fetchCartItems();
    }, []); // Memanggil fetchCartItems sekali saat komponen pertama kali dimuat
    
    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const booking_code = 'BOOKING_CODE'; // Ganti dengan booking code yang sesuai
            const data = await OrderService.fetchCart(booking_code);
            console.log(data); // Cek data yang diterima
            setCartItems(data.data);
    
            const totalAmount = data.data.reduce((sum, item) => sum + item.price, 0);
            setTotal(totalAmount);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };
    

    // Fungsi untuk menghapus item dari cart
    const handleRemoveFromCart = async (food_id) => {
        try {
            const booking_code = 'BOOKING_CODE'; // Ganti dengan booking code yang sesuai
            await OrderService.removeFromCart(booking_code, food_id);
            setCartItems(cartItems.filter((item) => item.food_id !== food_id)); // Hapus item dari state
        } catch (error) {
            console.error('Error removing item from cart:', error.message);
        }
    };

    // Fungsi untuk melakukan pemesanan
    const handleBook = async () => {
        try {
            const booking_code = 'BOOKING_CODE'; // Ganti dengan booking code yang sesuai
            await OrderService.bookOrder(booking_code);
            alert('Booking successful!');
            history.push('/order-confirmation'); // Redirect ke halaman konfirmasi pemesanan
        } catch (error) {
            console.error('Error booking order:', error.message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {cartItems.length > 0 ? (
                        <div>
                            {/* Daftar item dalam keranjang */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {cartItems.map((item) => (
                                    <div key={item.food_id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                            <img src={item.photo} alt={item.name} className="w-full h-40 object-cover rounded-lg" />
                                            <p className="mt-2">Price: ${item.price}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="flex justify-between items-center p-4">
                                            <button
                                                onClick={() => handleRemoveFromCart(item.food_id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total harga */}
                            <div className="mt-6 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Total: ${total}</h3>
                                <button
                                    onClick={handleBook}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Your cart is empty</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;
