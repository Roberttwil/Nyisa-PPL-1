import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

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
    const response = await axios.post(`${API_URL}/login`, {
      username,
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

export const verifyOtp = async (username, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { username, otp });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Simpan token di localStorage
    }
    return response.data; // Return token atau data lainnya
  } catch (error) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};
