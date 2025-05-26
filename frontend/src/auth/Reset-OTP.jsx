import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { verifyResetOtp, resendOtp } from "../services/AuthService";
import daun from "../assets/Union.svg";
import star from "../assets/starGeo.svg";
import circleH from "../assets/circleHalf.svg";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("registeredUsername");
    const storedEmail = localStorage.getItem("registeredEmail");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);

    if (!storedUsername || !storedEmail) {
      setErrorMessage("No account data found. Please register first.");
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }

      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const enteredOtp = otp.join("");

    try {
      await verifyResetOtp(username, enteredOtp);
      setSuccessMessage("Verification successful! Redirecting...");
      setTimeout(() => {
        navigate("/reset");
      }, 3000);
    } catch (error) {
      setErrorMessage("Incorrect OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);
    setErrorMessage("");

    try {
      await resendOtp(username, email);
      setResendTimer(30);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setResendLoading(false);
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

      {/* Register Form Container - Adjusted for responsiveness, identical to Login */}
      <div className="w-full max-w-md p-8 text-center bg-[#D6E9A6] rounded-3xl z-10">
        <h2 className="text-2xl font-semibold text-green-900 mb-6">
          OTP Reset Password Verify
        </h2>
        <p className="text-sm text-green-900 mb-6">
          We have sent an OTP code to your email. Please check your email and
          enter your 6-digit OTP code.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                className="w-14 h-14 text-xl text-center border-2 border-green-900 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-300  bg-white"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-900 text-white font-bold text-lg rounded-full mb-4 hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Enter code"}
          </button>

          {errorMessage && (
            <p className="text-red-600 font-bold mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 font-bold mt-2">{successMessage}</p>
          )}

          <button
            type="button"
            className="mt-4 text-green-700 font-bold underline hover:text-green-900"
            onClick={handleResendOtp}
            disabled={resendLoading || resendTimer > 0}
          >
            {resendLoading
              ? "Resending..."
              : resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : "Resend OTP"}
          </button>
        </form>
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

export default OTP;
