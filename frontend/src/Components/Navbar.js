import React, { useState } from "react";
import { Menu, X } from "lucide-react";
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

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/images/logo-nyisa.png" alt="Logo" />
        </div>
        <ul className="navbar-menu">
          {navItems.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        
        {/* Bagian kanan untuk welcome dan tombol logout */}
        <div className="navbar-user-info">
          <span className="welcome-text">Welcome, User!</span>
          <button className="logout-btn">Log Out</button>
        </div>

        <div className="navbar-menu-mobile">
          <button onClick={toggleNavbar} className="menu-btn">
            {mobileDrawerOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Drawer mobile menu */}
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
