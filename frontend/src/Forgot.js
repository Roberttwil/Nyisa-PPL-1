import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "./AuthService";
import "./Forgot.css";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await forgotPassword(username, email);
      setMessage(response.message);

      setTimeout(() => {
        navigate("/otp");
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />

      <h2 className="form-title">Reset your password</h2>
      <p className="form-subtitle">
        Forgot your password? Please enter your username and email, and we'll send you a 6-digit code.
      </p>

      <form className="forgot-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Processing..." : "Get 6-digit code"}
        </button>
      </form>

      {error && <p className="error-message" style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>{error}</p>}
      {message && <p className="success-message" style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
