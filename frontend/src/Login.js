import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./AuthService";  // Import login from AuthService
import "./Login.css";

const InputField = ({ type, placeholder, value, onChange }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper">
      <input
        type={isPasswordShown ? "text" : type}
        placeholder={placeholder}
        className="input-field"
        value={value}  // Bind value to the state
        onChange={onChange}  // Bind onChange to update the state
        required
      />
      {type === "password" && (
        <i
          onClick={() => setIsPasswordShown((prev) => !prev)}
          className="eye-icon"
        >
          {isPasswordShown ? "👁️" : "👁️‍🗨️"}
        </i>
      )}
    </div>
  );
};

const SocialLogin = () => {
  return (
    <div className="social-login">
      <button className="social-button">
        <img src="/images/google.png" alt="Google" className="social-icon" />
        Google
      </button>
      <button className="social-button">
        <img src="/images/facebook.png" alt="Facebook" className="social-icon" />
        Facebook
      </button>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");  // Changed to username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // State for error handling
  const [rememberMe, setRememberMe] = useState(false);  // State for "Remember me"
  const [loading, setLoading] = useState(false);  // State for loading
  const navigate = useNavigate();  // Hook for navigation after login

  // Load username and rememberMe from localStorage if it exists
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedUsername && savedRememberMe) {
      setUsername(savedUsername);
      setRememberMe(true);  // Set rememberMe to true if it's stored
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");  
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      const response = await login(username, password);
      console.log("Login Response:", response); // Debugging
  
      if (!response.isVerified) {
        throw new Error("Your account is not verified. Please check your email for the OTP verification.");
      }
  
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("username");
      }
  
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };  

  // // Handle logout
  // const handleLogout = () => {
  //   localStorage.removeItem("rememberMe");
  //   localStorage.removeItem("username");  // Remove username and rememberMe when logging out
  //   setUsername("");  // Clear username state
  //   setRememberMe(false);  // Uncheck rememberMe state
  //   navigate("/login");  // Navigate back to login page
  // };

  return (
    <div className="login-container">
      <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />

      <h2 className="form-title">Sign In</h2>
      <p className="form-subtitle">
        Hello, please enter your details to get sign in to your account
      </p>

      <form className="login-form" onSubmit={handleLogin}>
        {/* Input for username */}
        <InputField
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Input for password */}
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Show error if any */}
        {error && <p className="error-message">{error}</p>}

        {/* "Remember me" option */}
        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            /> Remember me
          </label>
          <Link to="/forgot" className="forgot-password-link">
            Forgot password?
          </Link>
        </div>

        {/* Login button */}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Sign In"} {/* Show loading text while processing */}
        </button>
      </form>

      {/* Show loading spinner */}
      {loading && <div className="loading-spinner">Loading...</div>}

      <p className="separator">Or Sign In with</p>

      <SocialLogin />

      <p className="signup-prompt">
        Don't have an account? <Link to="/register" className="signup-link">Sign Up here</Link>
      </p>

      {/* Add logout button
      <button onClick={handleLogout} className="logout-button">Logout</button> */}
    </div>
  );
};

export default Login;
