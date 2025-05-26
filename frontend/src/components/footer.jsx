import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <footer className="bg-[#d3d5c8] text-green-900 pt-10 md:px-0">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start px-6 md:px-12 gap-8">
        {/* Logo + Contact */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-4">
          <div className="flex justify-center md:justify-start md:-ml-7">
            <img
              src={nyisaLogo}
              alt="Nyisa Logo"
              className="h-27 md:h-37 md:-mt-9 -mt-5"
            />
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h3 className="font-bold text-lg mb-2">Contact Us</h3>
            <p className="font-medium">robertwilliam@gmail.com</p>
            <p className="font-semibold">+62 8125 0087 0912</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
<div className="bg-[#bfc1b4] mt-8 px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-green-900 font-medium gap-4">
  <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 order-1 md:order-2">
    <Link
      to="/terms-conditions"
      className="hover:underline hover:text-green-800 cursor-pointer"
    >
      Terms & Conditions
    </Link>
    <span className="text-xl text-green-700">•</span>
    <Link
      to="/privacy-policy"
      className="hover:underline hover:text-green-800 cursor-pointer"
    >
      Privacy Policy
    </Link>
  </div>

  <span className="md:ml-2 order-2 md:order-1">© 2025 Nyisa</span>
</div>

    </footer>
  );
};

export default Footer;
