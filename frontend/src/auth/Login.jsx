import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import daun from "../assets/Union.svg";
import star from "../assets/starGeo.svg";
import circleH from "../assets/circleHalf.svg";
import googleLogo from "../assets/google.png";
import nyisaLogo from "../assets/nyisaLogo.png";
import { login } from "../services/AuthService"; // Import login from AuthService

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [popup, setPopup] = useState({
    show: false,
    type: "error", // Can be 'success' or 'error'
    message: "",
  });

  // Load username and rememberMe from localStorage if it exists
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedUsername && savedRememberMe) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setError(""); // Remove this line

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const response = await login(username, password);

      console.log("Login Response:", response);

      if (response.role) {
        console.log(`User logged in with role: ${response.role}`); // Use template literal for logging
        localStorage.setItem("role", response.role);
        localStorage.setItem("username", username); // Store username on successful login
      } else {
        console.error("Role not found in response");
        // If role is not found, treat it as a login error
        setPopup({
          show: true,
          type: "error",
          message: "Login failed: Invalid response from server.",
        });
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("username", username); // Ensure username is saved if rememberMe is true
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("username");
      }

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      // Set popup message for login failure
      setPopup({
        show: true,
        type: "error",
        message: "Invalid credentials! Please try again.", // Specific message as requested
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/social/google";
  };

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen px-4 relative">
      {/* Logo untuk layar besar (pojok kiri atas) */}
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

      {/* Form Container */}
      <div className="w-full max-w-md p-8 text-center bg-[#D6E9A6] rounded-3xl z-10">
        <h2 className="text-2xl font-semibold text-green-900 mb-2">Sign In</h2>
        <p className="text-green-800 text-sm mb-4 px-4 font-semibold">
          Hello, please enter your details to get sign in to your account
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium mx-2">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#103B28] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#103B28]"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4 text-left relative">
            <label className="block text-green-900 font-medium mx-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-[#103B28] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#103B28]"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute top-8 right-4 cursor-pointer text-green-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </span>
          </div>
          <div className="flex justify-between text-sm text-green-900 mb-4 flex-wrap gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 cursor-pointer"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <Link to="/forgot" className="font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className="my-4 text-green-900 font-medium">Or Sign In With</div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
          >
            <img src={googleLogo} alt="Google" className="w-5" />
            <span className="text-md font-medium text-gray-800">Google</span>
          </button>
        </div>
        <p className="mt-4 text-green-900 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>

      {/* Background decorative images */}
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
      <img src={star} alt="star" className="absolute w-8 top-10 right-10" />
      <img src={star} alt="star" className="absolute w-8 bottom-10 left-10" />

      {/* Popup modal for error messages */}
      {popup.show && (
        <div className="fixed inset-0 bg-gray-600/30 flex justify-center items-center z-50">
          <div
            className={`bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center border ${
              popup.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.type === "success" ? "Success!" : "Error!"}
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
    </div>
  );
};

export default Login;
