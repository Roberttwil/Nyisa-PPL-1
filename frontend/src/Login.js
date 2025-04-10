import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./AuthService"; 
import "./Login.css";

const InputField = ({ type, placeholder, value, onChange }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper">
      <input
        type={isPasswordShown ? "text" : type}
        placeholder={placeholder}
        className="input-field"
        value={value} 
        onChange={onChange} 
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
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [rememberMe, setRememberMe] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 


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
      
      const response = await login(username, password);
      console.log("Login Response:", response);
  
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

      <p className="separator">Or Sign In with</p>

      <SocialLogin />

      <p className="signup-prompt">
        Don't have an account? <Link to="/register" className="signup-link">Sign Up here</Link>
      </p>

    </div>
  );
};

export default Login;
