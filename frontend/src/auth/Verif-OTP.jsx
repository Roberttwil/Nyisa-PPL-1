import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nyisaLogo from "../assets/logo-nyisa.png";
import { verifyOtp, resendOtp } from "../service/AuthService";

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
      await verifyOtp(username, enteredOtp);
      setSuccessMessage("Verification successful! Redirecting...");
      setTimeout(() => {
        navigate("/login");
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
    <div className="relative flex justify-center items-center min-h-screen" style={{ backgroundImage: 'linear-gradient(to bottom,rgb(220, 235, 226) 50%, #68D391 80%)' }}>
      <div className="max-w-md w-full p-8 text-center">
      <img src={nyisaLogo} alt="Logo" className="mb-5 w-30 mx-auto" />
        <h2 className="text-2xl font-semibold text-green-900 mb-6">
          OTP Verify
        </h2>
        <p className="text-sm text-green-900 mb-6">
          We have sent an OTP code to <span className="font-bold">{email}</span>
          . Please enter your 6-digit OTP code.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                className="w-14 h-14 text-xl text-center border-2 border-green-900 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-300"
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
              ? `Resend in ${resendTimer}s`
              : "Resend OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTP;
