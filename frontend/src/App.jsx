import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Search from "./pages/search"
import Food from "./pages/foodlist"
import Cart from "./pages/cart"
import History from "./pages/history"
import Profile from "./pages/profile"
import Login from "./auth/Login";
import Register from "./auth/Register";
import VerifOTP from "./auth/Verif-OTP";
import Forgot from "./auth/Forgot";
import ResetOTP from "./auth/Reset-OTP";
import Reset from "./auth/Reset";
import Partner from "./pages/partner";
import RestoOTP from "./auth/Resto-OTP";
import Owner from "./pages/owner";
import Location from "./pages/location"
import SocialAuthSuccess from "./auth/socialAuthSucess";

function App() {
  const location = useLocation();
  const noNavbar = ["/login", "/register", "/forgot", "/otp", "/verif-otp", "/reset", "/partner", "/reset-otp", "/resto-otp", "/social-auth-success"];
  const noFooter = ["/login", "/register", "/forgot", "/otp", "/verif-otp", "/reset", "/partner", "/reset-otp", "/resto-otp", "/location",  "/social-auth-success"];


  return (
    <>
      {!noNavbar.includes(location.pathname) && <Navbar />}

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/food-list/:restoId" element={<Food />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verif-otp" element={<VerifOTP />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-otp" element={<ResetOTP />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/resto-otp" element={<RestoOTP />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/location" element={<Location />} />
          <Route path="/social-auth-success" element={<SocialAuthSuccess />} />
        </Routes>
      </div>

      {!noFooter.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;