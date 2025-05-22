import React, { useEffect, useState } from "react";
import { Home, Search, Map, ShoppingCart, History, Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { getProfile } from "../services/UserService";
import RestoService from "../services/RestoService";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);

      if (storedRole === "restaurant") {
        RestoService.getOwnerProfile(token)
          .then((data) => {
            if (data) {
              setUserProfile({ ...data, role: storedRole });
            }
          })
          .catch(() => {});
      } else {
        getProfile()
          .then((data) => {
            setUserProfile({ ...data, role: storedRole });
          })
          .catch(() => {
            setIsLoggedIn(false);
          });
      }
    }
  }, []);

  const handleAuthClick = () => {
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const isRestaurant = userProfile?.role === "restaurant";

  const handleProfileClick = () => {
    const isProfileActive = isRestaurant
      ? isActive("/owner")
      : isActive("/profile");

    if (isProfileActive) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(isRestaurant ? "/owner" : "/profile");
    }
  };

  const handleNavClick = (path) => {
    if (isActive(path)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-white z-50 h-20 flex items-center justify-between px-4 sm:px-8 md:px-10">
      <Link to="/" onClick={() => handleNavClick("/")} className="cursor-pointer">
        <img
          src={nyisaLogo}
          alt="Nyisa Logo"
          className="h-30 sm:h-30 md:h-32 -ml-3"
        />
      </Link>

      <button
        className="block md:hidden p-2 absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu size={24} />
      </button>

      <div className="hidden md:flex md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <div className="bg-[#D9E1D0] rounded-full px-4 py-2 flex space-x-4 items-center text-[#0D3B2E] font-medium text-sm md:text-base">
          <button
            onClick={() => handleNavClick("/")}
            className={`flex items-center gap-1 transition-all duration-200 hover:text-white hover:bg-[#0D3B2E] px-3 py-1 rounded-full ${
              isActive("/") ? "font-extrabold bg-[#0D3B2E] text-white" : ""
            }`}
          >
            <Home size={16} /> Home
          </button>
          <button
            onClick={() => handleNavClick("/search")}
            className={`flex items-center gap-1 transition-all duration-200 hover:text-white hover:bg-[#0D3B2E] px-3 py-1 rounded-full ${
              isActive("/search") ? "font-extrabold bg-[#0D3B2E] text-white" : ""
            }`}
          >
            <Search size={16} /> Search
          </button>
          <button
            onClick={() => handleNavClick("/location")}
            className={`flex items-center gap-1 transition-all duration-200 hover:text-white hover:bg-[#0D3B2E] px-3 py-1 rounded-full ${
              isActive("/location") ? "font-extrabold bg-[#0D3B2E] text-white" : ""
            }`}
          >
            <Map size={16} /> Location
          </button>
          {!isRestaurant && (
            <button
              onClick={() => handleNavClick("/cart")}
              className={`flex items-center gap-1 transition-all duration-200 hover:text-white hover:bg-[#0D3B2E] px-3 py-1 rounded-full ${
                isActive("/cart") ? "font-extrabold bg-[#0D3B2E] text-white" : ""
              }`}
            >
              <ShoppingCart size={16} /> Cart
            </button>
          )}
          <button
            onClick={() => handleNavClick("/history")}
            className={`flex items-center gap-1 transition-all duration-200 hover:text-white hover:bg-[#0D3B2E] px-3 py-1 rounded-full ${
              isActive("/history") ? "font-extrabold bg-[#0D3B2E] text-white" : ""
            }`}
          >
            <History size={16} /> History
          </button>
        </div>
      </div>

      <div>
        {isLoggedIn && userProfile ? (
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-full hover:bg-gray-100 transition text-xs sm:text-sm md:text-base cursor-pointer"
          >
            <img
              src={
                userProfile.owner && userProfile.owner.restaurant.photo
                  ? userProfile.owner.restaurant.photo
                  : userProfile.photo || "https://via.placeholder.com/40"
              }
              alt="Profile"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover bg-black"
            />
            <span className="hidden lg:inline font-semibold text-gray-800 truncate max-w-[100px] lg:max-w-none">
              {userProfile.owner
                ? userProfile.owner.name
                : userProfile.name || "Profile"}
            </span>
          </button>
        ) : (
          <button
            onClick={handleAuthClick}
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold bg-[#0D3B2E] text-white hover:bg-[#447247] hover:text-[#0D3B2E] transition text-xs sm:text-sm md:text-base cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg z-40">
          <div className="flex flex-col items-center py-2">
            <button
              onClick={() => handleNavClick("/")}
              className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 cursor-pointer ${
                isActive("/") ? "font-extrabold" : ""
              }`}
            >
              <Home size={16} className="mr-2" /> Home
            </button>
            <button
              onClick={() => handleNavClick("/search")}
              className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 cursor-pointer ${
                isActive("/search") ? "font-extrabold" : ""
              }`}
            >
              <Search size={16} className="mr-2" /> Search
            </button>
            <button
              onClick={() => handleNavClick("/location")}
              className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 cursor-pointer ${
                isActive("/location") ? "font-extrabold" : ""
              }`}
            >
              <Map size={16} className="mr-2" /> Location
            </button>
            {!isRestaurant && (
              <button
                onClick={() => handleNavClick("/cart")}
                className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 cursor-pointer ${
                  isActive("/cart") ? "font-extrabold" : ""
                }`}
              >
                <ShoppingCart size={16} className="mr-2" /> Cart
              </button>
            )}
            <button
              onClick={() => handleNavClick("/history")}
              className={`w-full flex items-center justify-center py-1.5 hover:bg-gray-200 cursor-pointer ${
                isActive("/history") ? "font-extrabold" : ""
              }`}
            >
              <History size={16} className="mr-2" /> History
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
