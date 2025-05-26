import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { forgotPassword } from "../services/AuthService";
import daun from "../assets/Union.svg";
import star from "../assets/starGeo.svg";
import circleH from "../assets/circleHalf.svg";

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
    <div className="flex flex-wrap justify-center items-center min-h-screen px-4 relative">
      {/* Nyisa Logo - Adjusted for responsiveness, identical to Login */}
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
      <img
        src={star}
        alt="star"
        className="absolute w-6 sm:w-12 top-24 right-12 sm:top-28 sm:right-60"
      />

      <img
        src={star}
        alt="star"
        className="absolute w-6 sm:w-9 bottom-24 left-12 sm:bottom-28 sm:left-70"
      />
    </div>
  );
};

export default ForgotPassword;
