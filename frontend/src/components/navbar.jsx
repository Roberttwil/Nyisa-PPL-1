import React, { useEffect, useState } from "react";
import { Home, Search, Map, ShoppingCart, History } from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { getProfile } from "../services/UserService";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      getProfile()
        .then((data) => setUserProfile(data))
        .catch((err) => {
          console.error("Profile fetch error:", err.message);
          setIsLoggedIn(false); // jika token invalid
        });
    }
  }, []);

  const handleAuthClick = () => {
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 bg-white z-50 h-24 flex items-center justify-between px-10">
      {/* Logo */}
      <Link to="/">
        <img src={nyisaLogo} alt="Nyisa Logo" className="h-35" />
      </Link>

      {/* Menu */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="bg-[#D9E1D0] rounded-full px-6 py-2 flex space-x-6 items-center text-[#0D3B2E] font-medium">
          <Link to="/" className={`flex items-center gap-1 hover:underline ${isActive("/") ? "font-extrabold" : ""}`}>
            <Home size={18} /> Home
          </Link>
          <Link to="/search" className={`flex items-center gap-1 hover:underline ${isActive("/search") ? "font-extrabold" : ""}`}>
            <Search size={18} /> Search
          </Link>
          <Link to="/location" className={`flex items-center gap-1 hover:underline ${isActive("/location") ? "font-extrabold" : ""}`}>
            <Map size={18} /> Location
          </Link>
          <Link to="/cart" className={`flex items-center gap-1 hover:underline ${isActive("/cart") ? "font-extrabold" : ""}`}>
            <ShoppingCart size={18} /> Cart
          </Link>
          <Link to="/history" className={`flex items-center gap-1 hover:underline ${isActive("/history") ? "font-extrabold" : ""}`}>
            <History size={18} /> History
          </Link>
        </div>
      </div>

      {/* Auth Button / Profile */}
      <div>
        {isLoggedIn && userProfile ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <img
              src={userProfile.photo || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover bg-black"
            />
            <span className="font-semibold text-gray-800">{userProfile.name || "Profile"}</span>
          </button>
        ) : (
          <button
            onClick={handleAuthClick}
            className="px-5 py-2 rounded-full font-semibold bg-[#0D3B2E] text-white hover:bg-[#447247] hover:text-[#0D3B2E] transition"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
