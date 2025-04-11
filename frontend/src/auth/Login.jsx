import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import facebookLogo from "../assets/facebook.png";
import googleLogo from "../assets/google.png";
import nyisaLogo from "../assets/logo-nyisa.png";
import { login } from "../service/AuthService";  // Import login from AuthService

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  
  const [rememberMe, setRememberMe] = useState(false);  
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();  

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
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const response = await login(username, password);  // Call login from AuthService
      console.log("Login Response:", response);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("username");
      }

      navigate("/");  // Redirect to home after successful login
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen" style={{ backgroundImage: 'linear-gradient(to bottom,rgb(220, 235, 226) 50%, #68D391 80%)' }}>
      <div className="max-w-md w-full p-8 text-center">
        <img src={nyisaLogo} alt="Logo" className="mb-5 w-30 mx-auto" />
        <h2 className="text-2xl font-semibold text-green-900 mb-2">Sign In</h2>
        <p className="text-green-800 text-sm mb-4">
          Hello, please enter your details to get sign in to your account
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4 text-left relative">
            <label className="block text-green-900 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute top-8 right-4 cursor-pointer text-green-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <div className="flex justify-between text-sm text-green-900 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 cursor-pointer" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} /> Remember me
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
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100">
            <img src={googleLogo} alt="Google" className="w-5" /> Google
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100">
            <img src={facebookLogo} alt="Facebook" className="w-5" /> Facebook
          </button>
        </div>
        <p className="mt-4 text-green-900 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
