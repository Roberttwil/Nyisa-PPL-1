import axios from "axios";

const API_URL = "http://localhost:5000/api/order";

// Helper untuk mengambil token JWT dari localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not available.");
  }
  return token;
};

const OrderService = {
  addToCart: async ({ booking_code, food_id, user_id }) => {
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage (atau tempat lain yang sesuai)
      if (!token) throw new Error("Missing token"); // Pastikan token ada

      const response = await axios.post(
        `${API_URL}/add/cart`,
        {
          booking_code,
          food_id,
          user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Kirimkan token dalam header
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error in addToCart:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Menghapus item dari cart
  removeFromCart: async (booking_code, food_id) => {
    try {
      const token = getToken(); // Ambil token JWT
      const response = await axios.post(
        `${API_URL}/remove/cart`,
        { booking_code, food_id },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token di header
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error removing from cart:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Mendapatkan isi cart berdasarkan booking_code
  getCart: async (booking_code) => {
    try {
      const token = getToken(); // Ambil token JWT
      const response = await axios.get(`${API_URL}/cart`, {
        params: { booking_code },
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token di header
        },
      });
      return response.data.cart;
    } catch (error) {
      console.error(
        "Error fetching cart:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Melakukan pemesanan (booking)
  bookOrder: async (booking_code) => {
    try {
      const token = getToken(); // Ambil token JWT
      const response = await axios.post(
        `${API_URL}/book`,
        { booking_code },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token di header
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error booking order:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Mendapatkan kode booking baru
  generateBookingCode: async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/booking-code`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token dalam request
        },
      });
  
      return response.data; // Jangan simpan di localStorage di sini!
    } catch (error) {
      console.error("Error generating booking code:", error);
      throw error;
    }
  },  
};

export default OrderService;
