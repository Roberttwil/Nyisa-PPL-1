import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./AuthService"; // Mengimpor fungsi register dari AuthService
import "./Register.css";

const InputField = ({ type, placeholder, name, value, onChange }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper">
      <input
        type={isPasswordShown ? "text" : type}
        placeholder={placeholder}
        name={name}
        className="input-field"
        value={value}
        onChange={onChange}
        required
      />
      {type === "password" && (
        <i onClick={() => setIsPasswordShown((prev) => !prev)} className="eye-icon">
          {isPasswordShown ? "👁️" : "👁️‍🗨️"}
        </i>
      )}
    </div>
  );
};

const SocialLogin = () => (
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

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setMessage("All fields are required!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await register(formData.username, formData.email, formData.password);
      setMessage(response.message); // Menampilkan pesan response dari API
      setTimeout(() => {
        // Navigasi ke halaman verifikasi OTP setelah sukses sign up
        navigate("/verif-otp");
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />
      
      <h2 className="form-title">Sign Up</h2>
      <p className="form-subtitle">Hello, please enter your details to create your account</p>

      <form className="register-form" onSubmit={handleRegister}>
        <InputField type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />
        <InputField type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
        <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {message && <p className="message" style={{ color: 'black', fontWeight: 'bold', marginTop: '10px'}}>{message}</p>}

      <p className="separator">Or Sign Up with</p>

      <SocialLogin />

      <p className="signup-prompt">
        Already have an account? <Link to="/login" className="signin-link">Sign In here</Link>
      </p>
    </div>
  );
};

export default Register;
