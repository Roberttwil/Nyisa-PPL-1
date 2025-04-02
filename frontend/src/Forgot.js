import { useState } from "react";
import "./Forgot.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted: ", email);
  };

  return (
    <div className="forgot-container">
      <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />
      
      <h2 className="form-title">Reset your password</h2>
      <p className="form-subtitle">
        Forgot your password? Please enter your email and we’ll send you a 4-digit code.
      </p>
      
      <form className="forgot-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
          required
        />
        <button type="submit" className="submit-button">Get 4-digit code</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
