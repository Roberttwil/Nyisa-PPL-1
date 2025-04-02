import axios from "axios";

const API_URL = "/api/auth";

// Fungsi untuk melakukan registrasi
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Menangani error jika ada
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    // Menangani error jika ada
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Fungsi untuk logout
export const logout = () => {
  localStorage.removeItem("token");
};

// Mendapatkan token dari localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Mengecek apakah user sudah login
export const isAuthenticated = () => {
  return !!getToken();
};
