import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { resetPassword } from "../services/AuthService";

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
        <div className="relative flex justify-center items-center min-h-screen" style={{ backgroundImage: 'linear-gradient(to bottom,rgb(220, 235, 226) 50%, #68D391 80%)' }}>
              <div className="max-w-md w-full p-8 text-center">
                <img src={nyisaLogo} alt="Logo" className="mb-5 w-30 mx-auto" />

                <h2 className="text-2xl font-semibold text-green-900 mb-2">Reset Password</h2>
                <p className="text-green-800 text-sm mb-4">
                    This password should be different from the previous password.
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4 text-left">
                        <label className="block text-green-900 font-medium" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-5 bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {message && <p className="text-green-600 font-bold mt-4">{message}</p>}
                {error && <p className="text-red-600 font-bold mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
