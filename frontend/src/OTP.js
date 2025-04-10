import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyResetOtp, resendOtp } from "./AuthService";
import "./OTP.css";

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

        if (storedUsername && storedEmail) {
            setUsername(storedUsername);
            setEmail(storedEmail);
        } else {
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

        if (enteredOtp.length !== 6) {
            setErrorMessage("OTP must be 6 digits.");
            setLoading(false);
            return;
        }

        try {
            await verifyResetOtp(username, enteredOtp);
            setSuccessMessage("Reset OTP verified! You may now reset your password.");
            setTimeout(() => {
                navigate("/reset");
            }, 2000);
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
        <div className="otp-container">
            <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />

            <h2 className="form-title">OTP Reset Password Verify</h2>
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

                {errorMessage && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>{successMessage}</p>}

                <button
                    type="button"
                    className="resend-button"
                    onClick={handleResendOtp}
                    disabled={resendLoading || resendTimer > 0}
                >
                    {resendLoading ? "Resending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
            </form>
        </div>
    );
};

export default OTP;
