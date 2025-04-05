import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Search from "./Components/Search";
import Location from "./Components/Location";
import Cart from "./Components/Cart";
import Account from "./Components/Account";
import Login from "./Login";
import Register from "./Register";
import Forgot from "./Forgot";
import OTP from "./OTP";
import VerifOTP from "./Verif-OTP";
import RequireAuth from "./RequireAuth";

function App() {
  const location = useLocation();

  const noNavbarFooter = ["/login", "/register", "/forgot", "/otp", "/verif-otp"];

  return (
    <>
      {!noNavbarFooter.includes(location.pathname) && <Navbar />}

      <div className="content">
        <Routes>
          <Route path="/" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } />
          <Route path="/search" element={<Search />} />
          <Route path="/location" element={<Location />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/verif-otp" element={<VerifOTP />} />
        </Routes>
      </div>

      {!noNavbarFooter.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
