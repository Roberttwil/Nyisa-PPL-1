import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "./AuthService";
import "./Reset.css";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil token dari URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    useEffect(() => {
        const storedOtp = localStorage.getItem("token");
        console.log("Token from URL:", token);
        if (!token) {
            console.warn("Token is missing from URL!");
        }
    }, [token]);    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if (!token) {
            setError("Invalid or missing token");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await resetPassword(token, newPassword);
            setMessage(response.message || "Password has been reset successfully!");

            setTimeout(() => {
                navigate("/login"); // Redirect ke login setelah berhasil
            }, 2500);
        } catch (err) {
            console.error("Reset password error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />

            <h2 className="form-title">Reset Password</h2>
            <p className="form-subtitle">
                This password should be different from the previous password.
            </p>

            <form className="reset-form" onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    required
                />
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ResetPassword;
