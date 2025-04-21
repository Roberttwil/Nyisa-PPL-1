import axios from 'axios';

const API_URL = 'http://localhost:5000/api/order';

const OrderService = {
  // Menambahkan item ke dalam cart
  addToCart: async (booking_code, user_id, food_id) => {
    try {
      const response = await axios.post(`${API_URL}/add/cart`, {
        booking_code,
        user_id,
        food_id
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data || error.message);
      throw error;
    }
  },

  // Menghapus item dari cart
  removeFromCart: async (booking_code, food_id) => {
    try {
      const response = await axios.post(`${API_URL}/remove/cart`, {
        booking_code,
        food_id
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error.response?.data || error.message);
      throw error;
    }
  },

  // Melakukan pemesanan (booking)
  bookOrder: async (booking_code) => {
    try {
      const response = await axios.post(`${API_URL}/book`, { booking_code });
      return response.data;
    } catch (error) {
      console.error('Error booking order:', error.response?.data || error.message);
      throw error;
    }
  },

  // Mendapatkan kode booking baru
  generateBookingCode: async () => {
    try {
      const response = await axios.get(`${API_URL}/booking-code`);
      return response.data.bookingCode;
    } catch (error) {
      console.error('Error generating booking code:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default OrderService;
