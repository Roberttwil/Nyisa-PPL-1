import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Location", href: "/location" },
  { label: "Cart", href: "/cart" },
  { label: "Account", href: "/account" },
];

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus(); // Mengecek status login saat pertama kali

    // Tambahkan event listener untuk memantau perubahan storage
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setIsLoggedIn(false);
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src="/images/logo-nyisa.png" alt="Logo" className="clickable-logo" />
        </div>
        <ul className="navbar-menu">
          {navItems.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        <div className="navbar-user-info">
          <button
            className={`auth-btn ${isLoggedIn ? "sign-out" : "sign-in"}`}
            onClick={handleAuth} >
            {isLoggedIn ? "Sign Out" : "Sign In"}
          </button>

        </div>

        <div className="navbar-menu-mobile">
          <button onClick={toggleNavbar} className="menu-btn">
            {mobileDrawerOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileDrawerOpen && (
        <div className="mobile-drawer">
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
