import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { resetPassword } from "../services/AuthService";
import daun from "../assets/Union.svg";
import star from "../assets/starGeo.svg";
import circleH from "../assets/circleHalf.svg";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Retrieve resetToken from localStorage
  const resetToken = localStorage.getItem("resetToken");

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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    // Real-time password validation
    const error = validatePassword(value);
    setPasswordError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Check if resetToken exists
    if (!resetToken) {
      setError("OTP token not found. Please verify OTP first.");
      return;
    }

    // Check if password has validation errors
    if (passwordError) {
      setError("Please fix password errors before submitting");
      return;
    }

    // Check if password is empty
    if (!newPassword) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      // Call the reset password function with the token from localStorage
      const response = await resetPassword(resetToken, newPassword);
      setMessage(response.message || "Password has been reset successfully.");

      // If a new token is returned, save it to localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      setTimeout(() => {
        navigate("/login"); // Redirect to login page after successfully resetting the password
      }, 2500);
    } catch (err) {
      console.error(
        "Failed to reset password:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen px-4 relative">
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
        <h2 className="text-2xl font-semibold text-green-900 mb-2">
          Reset Password
        </h2>
        <p className="text-green-800 text-sm mb-4">
          This password should be different from the previous password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="mb-4 text-left relative">
            <label
              className="block text-green-900 font-medium"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-green-700 focus:ring-green-500"
              }`}
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
            className="w-full mt-5 bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || passwordError}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && <p className="text-green-600 font-bold mt-4">{message}</p>}
        {error && <p className="text-red-600 font-bold mt-4">{error}</p>}
      </div>
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

export default ResetPassword;
