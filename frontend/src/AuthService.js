import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });

    localStorage.setItem("registeredUsername", username);
    localStorage.setItem("registeredEmail", email);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });

    console.log("Login response:", response.data); // Debugging

    // Ambil status verifikasi dari localStorage (karena API tidak mengembalikannya)
    const isVerified = localStorage.getItem("isVerified");

    if (isVerified !== "true") {
      throw new Error("Akun belum terverifikasi OTP");
    }

    // Simpan token hanya jika akun sudah diverifikasi
    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Fungsi untuk logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isVerified"); // Hapus status verifikasi saat logout
};

// Mendapatkan token dari localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Mengecek apakah user sudah login
export const isAuthenticated = () => {
  return !!getToken();
};

// Fungsi untuk verifikasi OTP
export const verifyOtp = async (username, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { username, otp });

    console.log("Verify OTP response:", response.data); // Debugging

    // Jika OTP valid, simpan token dan isVerified di localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isVerified", "true"); // Simpan status verifikasi
    }

    return response.data;
  } catch (error) {
    console.error("OTP verification error:", error.response?.data?.message || error.message); // Debugging
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};
