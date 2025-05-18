import React, { useEffect, useState } from "react";
import { Home, Search, Map, ShoppingCart, History, Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { getProfile } from "../services/UserService";
import RestoService from "../services/RestoService";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    console.log("Token:", token);
    console.log("Stored Role:", storedRole);

    if (token) {
      setIsLoggedIn(true);

      if (storedRole === "restaurant") {
        RestoService.getOwnerProfile(token)
          .then((data) => {
            console.log("Restaurant Profile Data:", data);
            if (data) {
              setUserProfile({ ...data, role: storedRole });
            } else {
              console.error("No data received for restaurant profile");
            }
          })
          .catch((err) => {
            console.error("Owner profile error:", err);
          });
      } else {
        getProfile()
          .then((data) => {
            console.log("User Profile Data:", data);
            setUserProfile({ ...data, role: storedRole });
          })
          .catch((err) => {
            console.error("User profile error:", err.message);
            setIsLoggedIn(false);
          });
      }
    }
  }, []);

  const handleAuthClick = () => {
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const handleProfileClick = () => {
    console.log("User role:", userProfile?.role);
    if (userProfile?.role === "restaurant") {
      navigate("/owner");
    } else {
      navigate("/profile");
    }
  };

  // Check if user role is restaurant to hide cart
  const isRestaurant = userProfile?.role === "restaurant";

  return (
    <nav className="sticky top-0 bg-white z-50 h-20 flex items-center justify-between px-4 sm:px-8 md:px-10">
      {/* Logo */}
      <Link to="/">
        <img
          src={nyisaLogo}
          alt="Nyisa Logo"
          className="h-30 sm:h-30 md:h-32 -ml-3"
        />
      </Link>

      <button
        className="block md:hidden p-2 absolute left-1/2 transform -translate-x-1/2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Menu for larger screens */}
      <div className="hidden md:flex md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <div className="bg-[#D9E1D0] rounded-full px-4 py-2 flex space-x-4 items-center text-[#0D3B2E] font-medium text-sm md:text-base">
          <Link
            to="/"
            className={`flex items-center gap-1 hover:underline ${
              isActive("/") ? "font-extrabold" : ""
            }`}
          >
            <Home size={16} /> Home
          </Link>
          <Link
            to="/search"
            className={`flex items-center gap-1 hover:underline ${
              isActive("/search") ? "font-extrabold" : ""
            }`}
          >
            <Search size={16} /> Search
          </Link>
          <Link
            to="/location"
            className={`flex items-center gap-1 hover:underline ${
              isActive("/location") ? "font-extrabold" : ""
            }`}
          >
            <Map size={16} /> Location
          </Link>

          {/* Only show Cart for non-restaurant users */}
          {!isRestaurant && (
            <Link
              to="/cart"
              className={`flex items-center gap-1 hover:underline ${
                isActive("/cart") ? "font-extrabold" : ""
              }`}
            >
              <ShoppingCart size={16} /> Cart
            </Link>
          )}

          {!isRestaurant && (
            <Link
              to="/history"
              className={`flex items-center gap-1 hover:underline ${
                isActive("/history") ? "font-extrabold" : ""
              }`}
            >
              <History size={16} /> History
            </Link>
          )}
        </div>
      </div>

      {/* Auth Button / Profile */}
      <div>
        {isLoggedIn && userProfile ? (
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition text-sm md:text-base"
          >
            <img
              src={
                userProfile.owner && userProfile.owner.restaurant.photo
                  ? userProfile.owner.restaurant.photo
                  : userProfile.photo || "https://via.placeholder.com/40"
              }
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover bg-black"
            />
            <span className="font-semibold text-gray-800">
              {userProfile.owner
                ? userProfile.owner.name
                : userProfile.name || "Profile"}
            </span>
          </button>
        ) : (
          <button
            onClick={handleAuthClick}
            className="px-4 py-2 rounded-full font-semibold bg-[#0D3B2E] text-white hover:bg-[#447247] hover:text-[#0D3B2E] transition text-sm md:text-base cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>

      {/* Mobile Menu for small screens */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg z-40">
          <div className="flex flex-col items-center py-2">
            <Link
              to="/"
              className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 ${
                isActive("/") ? "font-extrabold" : ""
              }`}
            >
              <Home size={16} className="mr-2" /> Home
            </Link>
            <Link
              to="/search"
              className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 ${
                isActive("/search") ? "font-extrabold" : ""
              }`}
            >
              <Search size={16} className="mr-2" /> Search
            </Link>
            <Link
              to="/location"
              className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 ${
                isActive("/location") ? "font-extrabold" : ""
              }`}
            >
              <Map size={16} className="mr-2" /> Location
            </Link>

            {/* Only show Cart for non-restaurant users in mobile menu too */}
            {!isRestaurant && (
              <Link
                to="/cart"
                className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 ${
                  isActive("/cart") ? "font-extrabold" : ""
                }`}
              >
                <ShoppingCart size={16} className="mr-2" /> Cart
              </Link>
            )}

            <Link
              to="/history"
              className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 ${
                isActive("/history") ? "font-extrabold" : ""
              }`}
            >
              <History size={16} className="mr-2" /> History
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
