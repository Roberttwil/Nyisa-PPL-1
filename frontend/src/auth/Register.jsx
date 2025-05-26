import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/google.png";
import nyisaLogo from "../assets/nyisaLogo.png";
import { register } from "../services/AuthService";

import daun from "../assets/Union.svg";
import star from "../assets/starGeo.svg";
import circleH from "../assets/circleHalf.svg";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // New popup state for OTP verification response
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Password validation function
  const validatePassword = (password) => {
    if (!password) {
      return "Password cannot be empty";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password.length > 12) {
      return "Password must be at most 12 characters";
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      return "Password must contain both letters and numbers";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time password validation
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      setPopup({
        show: true,
        type: "error",
        message: "All fields are required!",
      });
      return;
    }

    setLoading(true);
    setMessage("");
    setPasswordError("");

    try {
      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const response = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.phone
      );

      // Store username and email in localStorage to retrieve in OTP component
      localStorage.setItem("registeredUsername", formData.username);
      localStorage.setItem("registeredEmail", formData.email);

      // Show success popup with OTP verification message
      setPopup({
        show: true,
        type: "success",
        message:
          response.message ||
          "Registration successful! Please check your email for OTP verification.",
      });

      // Auto-navigate after showing popup
      setTimeout(() => {
        setPopup({ show: false, type: "success", message: "" });
        navigate("/verif-otp");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setPopup({
        show: true,
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Implement Google OAuth for registration if needed
    window.location.href = "http://localhost:5000/api/auth/social/google";
  };

  return (
    // Main container with responsive flex and background gradient
    <div className="flex flex-wrap justify-center items-center min-h-screen px-4 relative">
      {/* OTP Verification Response Modal Popup */}
      {popup.show && (
        <div className="fixed inset-0 bg-gray-600/30 flex justify-center items-center z-50">
          <div
            className={`bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center border-2 ${
              popup.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            <div
              className={`text-4xl mb-4 ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.type === "success" ? "✓" : "✗"}
            </div>
            <h2
              className={`text-2xl font-bold mb-4 ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.type === "success"
                ? "Registration Successful!"
                : "Registration Failed!"}
            </h2>
            <p className="mb-4 text-gray-700">{popup.message}</p>
            {popup.type === "success" ? (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Redirecting to OTP verification...
                </p>
                <div className="bg-green-600 h-1 rounded-full animate-pulse"></div>
              </div>
            ) : (
              <button
                onClick={() => setPopup({ ...popup, show: false })}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Nyisa Logo - Adjusted for responsiveness, identical to Login */}
      <img
        src={nyisaLogo}
        alt="Logo"
        className="hidden md:block absolute top-0 left-0 w-35"
      />

      {/* Logo untuk layar kecil (di atas "Sign In") */}
      <img
        src={nyisaLogo}
        alt="Logo"
        className="block md:hidden mx-auto w-26"
      />

      {/* Register Form Container - Adjusted for responsiveness, identical to Login */}
      <div className="w-full max-w-md p-8 text-center bg-[#D6E9A6] rounded-3xl z-10">
        <h2 className="text-2xl font-semibold text-green-900 mb-2">Sign Up</h2>
        <p className="text-green-800 text-sm mb-4 px-4 sm:px-0 font-semibold">
          Hello, please enter your details to create your account
        </p>
        <form onSubmit={handleRegister}>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium mx-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border border-[#103B28] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#103B28]"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium mx-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-[#103B28] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#103B28]"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium mx-2">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              className="w-full px-4 py-2 border border-[#103B28] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#103B28]"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left relative">
            <label className="block text-green-900 font-medium mx-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#103B28] focus:ring-[#103B28]"
              }`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="absolute top-8 right-4 cursor-pointer text-green-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </span>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || passwordError}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="text-black font-bold mt-4">{message}</p>}

        <div className="my-4 text-green-900 font-medium">Or Sign Up With</div>
        <div className="flex justify-center w-full">
          <button
            onClick={handleGoogleRegister}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5" />
            <span className="text-md font-medium text-gray-800">Google</span>
          </button>
        </div>

        <p className="mt-4 text-green-900 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>

      {/* Background Decorative Images - Hidden on small screens, shown on larger screens, identical to Login */}
      <img
        src={circleH}
        alt="circle"
        className="absolute w-20 sm:w-28 right-0 bottom-0"
      />
      <img
        src={daun}
        alt="daun"
        className="absolute w-16 sm:w-24 left-0 top-20 sm:top-32"
      />
      <img
        src={star}
        alt="star"
        className="absolute w-6 sm:w-12 top-24 right-12 sm:top-28 sm:right-60"
      />

      <img
        src={star}
        alt="star"
        className="absolute w-6 sm:w-9 bottom-24 left-12 sm:bottom-28 sm:left-70"
      />
    </div>
  );
};

export default Register;
