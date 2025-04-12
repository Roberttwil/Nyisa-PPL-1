import React from "react";
import { Home, Search, Map, ShoppingCart, User } from 'lucide-react';
import nyisaLogo from "../assets/nyisaLogo.png";

const Footer = () => {
    return (
      <footer className="bg-[#d3d5c8] text-green-900 pt-10 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Kolom 1 - Logo */}
            <img src={nyisaLogo} alt="Nyisa Logo" className="h-45 ml-5 -mt-10" />
          
  
          {/* Kolom 2 - Contact */}
          <div className="absolute left-60 mt-3">
            <div>
                <h3 className="font-bold mb-0.5 ">Contact us</h3>
                <p className="font-medium">robertwilliam@gmail.com</p>
                <p className="font-semibold">+62 8125 0087 0912</p>
            </div>
          </div>
          
  
          {/* Kolom 3 - Menu */}
            <div className="flex flex-col font-semibold gap-0.5 pr-25 text-lg">
                <div className="flex flex-row gap-17">
                    <a href="/" className="hover:underline hover:text-[#FF8A8A] active:text-[#FF8A8A] cursor-pointer">Home</a>
                    <a href="/" className="hover:underline hover:text-[#FF8A8A] active:text-[#FF8A8A] cursor-pointer">Account</a>
                </div>
                    <a href="/" className="hover:underline hover:text-[#FF8A8A] active:text-[#FF8A8A] cursor-pointer">Search</a>
                    <a href="/" className="hover:underline hover:text-[#FF8A8A] active:text-[#FF8A8A] cursor-pointer">Location</a>            </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  