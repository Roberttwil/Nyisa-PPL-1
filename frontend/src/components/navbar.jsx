import React from "react";
import { Home, Search, Map, ShoppingCart, User } from 'lucide-react';
import { Link } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";

function Navbar(){
    return(
        <nav className="sticky top-0 bg-white z-50 h-30 flex items-center justify-evenly gap-20">
      {/* Logo image */}
      <Link to="/">
        <img src={nyisaLogo} alt="Nyisa Logo" className="h-40 sticky" />
      </Link>

      {/* Menu */}
      <div className="pr-17 ">
      <div className="bg-[#D9E1D0] rounded-full px-6 py-2 flex space-x-6 items-center text-[#0D3B2E] font-medium">
        <a href="/" className="flex items-center gap-1 hover:underline">
          <Home size={18} /> Home
        </a>
        <a href="/search" className="flex items-center gap-1 hover:underline">
          <Search size={18} /> search
        </a>
        <a href="#" className="flex items-center gap-1 hover:underline">
          <Map size={18} /> location
        </a>
        <a href="#" className="flex items-center gap-1 hover:underline">
          <ShoppingCart size={18} /> cart
        </a>
        <a href="#" className="flex items-center gap-1 hover:underline">
          <User size={18} /> account
        </a>
      </div>
      </div>

      <div className="sticky right-35">
        <a href="/login" className="bg-[#0D3B2E] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#D9E1D0] hover:text-[#0D3B2E] transition duration-100 cursor-pointer ">Sign in</a>
      </div>
      
    </nav>
    );
}

export default Navbar