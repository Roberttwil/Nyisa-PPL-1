import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { forgotPassword } from "../services/AuthService";

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

      // Simpan username dan email ke localStorage
      localStorage.setItem("registeredUsername", username);
      localStorage.setItem("registeredEmail", email);

      setTimeout(() => {
        navigate("/reset-otp");
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen"
      style={{
        backgroundImage:
          "linear-gradient(to bottom,rgb(220, 235, 226) 50%, #68D391 80%)",
      }}
    >
      <div className="max-w-md w-full p-8 text-center">
        <img src={nyisaLogo} alt="Logo" className="mb-5 w-30 mx-auto" />

        <h2 className="text-2xl font-semibold text-green-900 mb-5">
          Forgot password
        </h2>
        <p className="text-sm text-green-900 mb-6">
          Forgot your password? Please enter your username and email, and we'll
          send you a 6-digit code.
        </p>

        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleSubmit}
        >
          <div className="text-left w-full">
            <label className="block text-green-900 font-medium">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div className="w-full relative text-left">
            <label className="block text-green-900 font-medium">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-green-900 text-white font-semibold rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-700 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Processing..." : "Get 6-digit code"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 font-semibold">{error}</p>}
        {message && (
          <p className="text-green-600 mt-4 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
