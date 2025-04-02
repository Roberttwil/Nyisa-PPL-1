import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const InputField = ({ type, placeholder }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper">
      <input
        type={isPasswordShown ? "text" : type}
        placeholder={placeholder}
        className="input-field"
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
  return (
    <div className="login-container">
      <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />
      
      <h2 className="form-title">Sign In</h2>
      <p className="form-subtitle">
        Hello, please enter your details to get sign in to your account
      </p>

      <form className="login-form">
        <InputField type="email" placeholder="Enter your email" />
        <InputField type="password" placeholder="Password" />

        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/forgot" className="forgot-password-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="login-button">Sign In</button>
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
