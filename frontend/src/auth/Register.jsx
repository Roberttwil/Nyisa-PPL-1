import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import facebookLogo from "../assets/facebook.png";
import googleLogo from "../assets/google.png";
import nyisaLogo from "../assets/logo-nyisa.png";
import { register } from "../service/AuthService";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      setMessage("All fields are required!");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await register(formData.username, formData.email, formData.password, formData.phone);
      setMessage(response.message);
      setTimeout(() => navigate("/verif-otp"), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen" style={{ backgroundImage: 'linear-gradient(to bottom,rgb(220, 235, 226) 50%, #68D391 80%)' }}>
      <div className="max-w-md w-full p-8 text-center">
        <img src={nyisaLogo} alt="Logo" className="mb-5 w-30 mx-auto" />
        <h2 className="text-2xl font-semibold text-green-900 mb-2">Sign Up</h2>
        <p className="text-green-800 text-sm mb-4">
          Hello, please enter your details to create your account
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
          <div className="mb-4 text-left relative">
            <label className="block text-green-900 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="absolute top-8 right-4 cursor-pointer text-green-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {message && <p className="text-black font-bold mt-4">{message}</p>}
        <div className="my-4 text-green-900 font-medium">Or Sign Up With</div>
        <div className="flex gap-3 justify-center">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100">
            <img src={googleLogo} alt="Google" className="w-5" /> Google
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100">
            <img src={facebookLogo} alt="Facebook" className="w-5" /> Facebook
          </button>
        </div>
        <p className="mt-4 text-green-900 text-sm">
          Already have an account? <Link to="/login" className="font-semibold hover:underline">Sign In here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
