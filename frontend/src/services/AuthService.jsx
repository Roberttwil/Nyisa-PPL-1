import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register function
export const register = async (username, email, password, phone) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
      phone,
    });

    localStorage.setItem("registeredUsername", username);
    localStorage.setItem("registeredEmail", email);
    localStorage.setItem("registeredPhone", phone);

    // Log user_id after registration (if available in the response)
    console.log("User ID from registration:", response.data.user_id);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login function
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    console.log("Login response:", response.data); // Debugging

    const isVerified = localStorage.getItem("isVerified");

    if (isVerified !== "true") {
      throw new Error("Akun belum terverifikasi OTP");
    }

    // Save token and user_id to localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user_id", response.data.user_id); // Assuming the response contains user_id

    // Log user_id after successful login
    console.log("User ID from login:", response.data.user_id);

    return response.data;
  } catch (error) {
    console.error(
      "Login error:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isVerified"); // Remove verification status when logging out
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// OTP verification function
export const verifyOtp = async (username, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, {
      username,
      otp,
    });

    console.log("Verify OTP response:", response.data); // Debugging

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isVerified", "true"); // Save verification status
    }

    return response.data;
  } catch (error) {
    console.error(
      "OTP verification error:",
      error.response?.data?.message || error.message
    ); // Debugging
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};

// Resend OTP function
export const resendOtp = async (username, email) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp`, {
      username,
      email,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Resend OTP error:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to resend OTP");
  }
};

// Forgot password function
export const forgotPassword = async (username, email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, {
      username,
      email,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Forgot password error:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to send reset OTP"
    );
  }
};

// Verify reset OTP function
export const verifyResetOtp = async (username, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-reset-otp`, {
      username,
      otp,
    });

    if (response.data.token) {
      localStorage.setItem("resetToken", response.data.token);
    }

    console.log("OTP response:", response.data);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to verify reset OTP"
    );
  }
};

// Reset password function
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}/reset-password`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Reset response:", response.data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Reset Password Error:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};

// Register restaurant function, which includes geocoding the address
export const registerRestaurant = async ({
  username,
  password,
  email,
  phone,
  restaurantName,
  restaurantType,
  address,
}) => {
  try {
    // Send the registration data, including the geocoded coordinates
    const response = await axios.post(`${API_URL}/register-restaurant`, {
      username,
      password,
      email,
      phone,
      restaurantName,
      restaurantType,
      address,
    });

    console.log("Address being sent:", address);

    // Optionally store some data in localStorage for later use (e.g., after successful registration)
    localStorage.setItem("registeredUsername", username);
    localStorage.setItem("registeredEmail", email);

    return response.data; // Return server response (e.g., confirmation message)
  } catch (error) {
    console.error(
      "Register Restaurant Error:",
      error.response?.data?.message || error.message
    );
    // Throw a descriptive error message if registration fails
    throw new Error(
      error.response?.data?.message || "Register Restaurant failed"
    );
  }
};
