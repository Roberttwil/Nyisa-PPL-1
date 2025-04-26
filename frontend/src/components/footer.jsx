import React from "react";
import { Link } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";

const Footer = () => {
  return (
    <footer className="bg-[#d3d5c8] text-green-900 pt-10 md:px-0">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start px-6 md:px-12 gap-8">
        {/* Logo + Contact */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-4">
          {/* Logo */}
          <div className="flex justify-center md:justify-start md:-ml-7">
            <img
              src={nyisaLogo}
              alt="Nyisa Logo"
              className="h-27 md:h-37 md:-mt-9 -mt-5"
            />
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h3 className="font-bold text-lg mb-2">Contact Us</h3>
            <p className="font-medium">robertwilliam@gmail.com</p>
            <p className="font-semibold">+62 8125 0087 0912</p>
          </div>
        </div>

        {/* Menu - kalau mau aktifkan */}
        {/* 
        <div className="flex flex-col font-semibold gap-1 text-md items-center md:items-end">
          <a href="/" className="hover:underline hover:text-[#54986a] cursor-pointer">Home</a>
          <a href="/search" className="hover:underline hover:text-[#54986a] cursor-pointer">Search</a>
          <a href="/" className="hover:underline hover:text-[#54986a] cursor-pointer">Location</a>
        </div>
        */}
      </div>

      {/* Bottom Section */}
      <div className="bg-[#bfc1b4] mt-8 px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-green-900 font-medium gap-4">
        <span className="ml-2">© 2025 Nyisa</span>
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
          <span className="hover:underline hover:text-[#54986a] cursor-pointer">
            Terms & Conditions
          </span>
          <span className="text-xl text-green-700">•</span>
          <span className="hover:underline hover:text-[#54986a] cursor-pointer">
            Privacy Policy
          </span>
          <span className="text-xl text-green-700">•</span>
          <Link
            to="/partner"
            className="hover:underline hover:text-[#54986a] cursor-pointer"
          >
            Being Nyisa Partner
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
