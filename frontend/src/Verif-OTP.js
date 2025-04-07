import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "./AuthService";
import "./OTP.css";

const OTP = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
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

    return (
        <div className="otp-container">
            <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />

            <h2 className="form-title">OTP Verify</h2>
            <p className="form-subtitle">
                We have sent an OTP code to <span className="highlight">{email}</span>.
                Please enter your 6-digit OTP code.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="otp-input-container">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            className="otp-input"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Verifying..." : "Enter code"}
                </button>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );  
};

export default OTP;
