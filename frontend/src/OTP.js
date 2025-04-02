import { useState } from "react";
import "./OTP.css";

const OTP = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("OTP Submitted: ", otp.join(""));
    };

    return (
        <div className="otp-container">
            <img src="/images/logo-nyisa.png" alt="Logo" className="logo" />

            <h2 className="form-title">Reset your password</h2>
            <p className="form-subtitle">
                We have sent OTP code to <span className="highlight">nyisa@gmail.com</span>. 
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
                        />
                    ))}
                </div>

                <button type="submit" className="submit-button">Enter code</button>
            </form>
        </div>
    );
};

export default OTP;
