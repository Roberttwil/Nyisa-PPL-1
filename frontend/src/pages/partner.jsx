import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { registerRestaurant } from "../services/AuthService"; // Assuming you have this function to handle registration
import daun from "../assets/Union.svg";
import star from "../assets/starGeo.svg";
import circleH from "../assets/circleHalf.svg";

const Partner = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    restaurantName: "",
    email: "",
    phone: "",
    address: "",
    genre: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // New popup state for OTP verification response
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

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

    // Validate password in real-time
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Log the address to verify its format
    console.log("Address to geocode:", formData.address);

    // Cek apakah semua field telah diisi
    if (
      !formData.username ||
      !formData.password ||
      !formData.restaurantName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.genre
    ) {
      setPopup({
        show: true,
        type: "error",
        message: "All fields are required!",
      });
      return;
    }

    // Check if password has validation errors
    if (passwordError) {
      setPopup({
        show: true,
        type: "error",
        message: "Please fix password errors before submitting",
      });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Buat formData untuk mengirimkan data ke backend
      const formDataToSend = new FormData();
      formDataToSend.append("restaurantName", formData.restaurantName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("genre", formData.genre);

      // Lakukan request untuk registrasi restoran
      const response = await registerRestaurant({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        restaurantName: formData.restaurantName,
        restaurantType: formData.genre,
        address: formData.address,
      });

      // Cek jika registrasi berhasil berdasarkan response message
      if (
        response.message &&
        response.message.includes("OTP sent to your email")
      ) {
        // Show success popup with OTP verification message
        setPopup({
          show: true,
          type: "success",
          message:
            response.message ||
            "Restaurant registration successful! Please check your email for OTP verification.",
        });

        // Auto-navigate after showing popup
        setTimeout(() => {
          setPopup({ show: false, type: "success", message: "" });
          navigate("/resto-otp", {
            state: { email: formData.email },
          });
        }, 3000);
      } else {
        setPopup({
          show: true,
          type: "error",
          message: response.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      const errorMessage =
        error.message || "Registration failed. Please try again.";

      setPopup({
        show: true,
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen px-4 relative">
      {/* Restaurant OTP Verification Response Modal Popup */}
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
                ? "Restaurant Registration Successful!"
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
      <div className="w-full max-w-md p-8 text-center bg-[#D6E9A6] rounded-3xl z-10">
        <h2 className="text-2xl font-semibold text-green-900 mb-2">
          Partner Sign Up
        </h2>
        <p className="text-green-800 text-sm mb-4">
          Please enter your restaurant details to create your partner account
        </p>
        <form onSubmit={handleRegister}>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 text-left relative">
            <label className="block text-green-900 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-green-700 focus:ring-green-500"
              }`}
              placeholder="Enter a secure password"
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

          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">
              Restaurant Name
            </label>
            <input
              type="text"
              name="restaurantName"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter restaurant name"
              value={formData.restaurantName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Address</label>
            <input
              type="text"
              name="address"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter restaurant address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Genre</label>
            <input
              type="text"
              name="genre"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter restaurant genre"
              value={formData.genre}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 cursor-pointer mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || passwordError}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {message && <p className="text-black font-bold mt-4">{message}</p>}
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
      <img src={star} alt="star" className="absolute w-8 top-10 right-10" />
      <img src={star} alt="star" className="absolute w-8 bottom-10 left-10" />
    </div>
  );
};

export default Partner;
