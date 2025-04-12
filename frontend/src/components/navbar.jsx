import React from "react";
import { Home, Search, Map, ShoppingCart, User } from 'lucide-react';
import nyisaLogo from "../assets/nyisaLogo.png";

function Navbar(){
    return(
        <nav className="h-30 flex items-center justify-between">
      {/* Logo image */}
        <img src={nyisaLogo} alt="Nyisa Logo" className="h-40" />

      {/* Menu */}
      <div className="pr-30 mx-auto">
      <div className="bg-[#D9E1D0] rounded-full px-6 py-2 flex space-x-6 items-center text-[#0D3B2E] font-medium">
        <a href="/" className="flex items-center gap-1 hover:underline">
          <Home size={18} /> Home
        </a>
        <a href="#" className="flex items-center gap-1 hover:underline">
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
      
    </nav>
    );
}

export default Navbar