import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import Navbar from "./Components/Navbar";
// import Footer from "./Components/Footer";
import Home from "./Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import VerifOTP from "./Auth/Verif-OTP";
import Forgot from "./Auth/Forgot";
import ResetOTP from "./Auth/Reset-OTP";
import Reset from "./Auth/Reset";

function App() {
  // const location = useLocation();
  // const noNavbarFooter = ["/login", "/register", "/forgot", "/otp", "/verif-otp", "/reset"];

  return (
    <>
      {/* {!noNavbarFooter.includes(location.pathname) && <Navbar />} */}

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verif-otp" element={<VerifOTP />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-otp" element={<ResetOTP />} />
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </div>

      {/* {!noNavbarFooter.includes(location.pathname) && <Footer />} */}
    </>
  );
}

export default App;
