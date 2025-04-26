import React from "react";
import { Home, Search, Map, ShoppingCart, User } from "lucide-react";
import nyisaLogo from "../assets/nyisaLogo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#d3d5c8] text-green-900 pt-10 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start">
        {/* Kolom 1 - Logo */}
        <img src={nyisaLogo} alt="Nyisa Logo" className="h-45 ml-5 -mt-10" />

        {/* Kolom 2 - Contact */}
        <div className="absolute left-60 mt-3">
          <div>
            <h3 className="font-bold mb-0.5 ">Contact Us</h3>
            <p className="font-medium">robertwilliam@gmail.com</p>
            <p className="font-semibold">+62 8125 0087 0912</p>
          </div>
        </div>

        {/* Kolom 3 - Menu */}
        <div className="flex flex-col font-semibold gap-0.5 pr-25 text-md">
          <div className="flex flex-row gap-17">
            <a
              href="/"
              className="hover:underline hover:text-[#54986a] cursor-pointer"
            >
              Home
            </a>
          </div>
          <a
            href="/search"
            className="hover:underline hover:text-[#54986a] cursor-pointer"
          >
            Search
          </a>
          <a
            href="/"
            className="hover:underline hover:text-[#54986a] cursor-pointer"
          >
            Location
          </a>
        </div>
      </div>

      {/* Footer Bottom - Pemisahan dengan warna berbeda */}
      <div className="bg-[#bfc1b4] px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center text-md text-green-900 font-medium">
        <span className="ml-4 mb-2 md:mb-0">© 2025 Nyisa</span>
        <div className="flex flex-wrap justify-center items-center gap-2 mr-4 md:gap-3 text-center">
          <span className="hover:underline hover:text-[#54986a] underline-offset-4 cursor-pointer">
            Terms & Conditions
          </span>
          <span className="text-xl text-green-700">•</span>
          <span className="hover:underline hover:text-[#54986a] underline-offset-4 cursor-pointer">
            Privacy Policy
          </span>
          <span className="text-xl text-green-700">•</span>
          <Link to="/partner" className="hover:underline hover:text-[#54986a] underline-offset-4 cursor-pointer">
            Being Nyisa Partner
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
