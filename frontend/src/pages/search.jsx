import React from "react";
import { Link } from "react-router-dom";
import poster3 from "../assets/poster3.svg";
import poster2 from "../assets/poster2.svg";
import poster1 from "../assets/poster1.svg";
import contohLogo from "../assets/logo_mcd.png";
import contohBg from "../assets/mcd.jpg";
import PostCard from "../components/postcard";

function Search (){
    return(
        <div className="flex flex-col my-25">
            <div className="flex flex-row gap-10 w-full justify-center mb-50">
                <Link to="/">
                    <img src={poster2} className="w-50" />
                </Link>
                <Link to="/">
                    <img src={poster1} className="w-50" />
                </Link>
                <Link to="/">
                    <img src={poster3} className="w-50" />
                </Link>
            </div>

            <div className="flex flex-col items-center">
                <div className="flex flex-row gap-150 font-semibold text-[#0D3B2E]">
                    <p>Rekomendasi hari ini</p>
                    <a href="/" className="hover:underline">Lihat semua</a>
                </div>
                
                <div  className="flex flex-row gap-15 justify-start mt-5">
                    <PostCard image={contohBg} logo={contohLogo} text="Mcdonald"/>
                    <PostCard image={contohBg} logo={contohLogo} text="Hi Dog"/>
                    <PostCard image={contohBg} logo={contohLogo} text="mcdokdae"/>
                </div>

                <div className="flex flex-row gap-45 mt-30">
                    <p className="bg-[#D9E1D0] w-45 py-2 rounded-lg text-center font-medium text-[#0D3B2E]">Filter</p>
                    <p className="bg-[#D9E1D0] w-45 py-2 rounded-lg text-center font-medium text-[#0D3B2E]">Ini apa cok</p>
                    <p className="bg-[#D9E1D0] w-45 py-2 rounded-lg text-center font-medium text-[#0D3B2E]">sama ini juga</p>
                </div>

                <div className="flex flex-row gap-5 justify-start mt-10 w-4xl">
                    <PostCard image={contohBg} logo={contohLogo} text="Mcdonald"/>
                    <PostCard image={contohBg} logo={contohLogo} text="Hi Dog"/>
                    <PostCard image={contohBg} logo={contohLogo} text="mcdokdae"/>
                    <PostCard image={contohBg} logo={contohLogo} text="mcdonkit"/>
                </div>

                <div className="flex flex-row gap-5 justify-start mt-10 w-4xl">
                    <PostCard image={contohBg} logo={contohLogo} text="Mcdonald"/>
                    <PostCard image={contohBg} logo={contohLogo} text="Hi Dog"/>
                    <PostCard image={contohBg} logo={contohLogo} text="mcdokdae"/>
                    <PostCard image={contohBg} logo={contohLogo} text="mcdogjawa"/>
                </div>

                <div className="flex flex-row gap-5 justify-start mt-10 w-4xl">
                    <PostCard image={contohBg} logo={contohLogo} text="Mcdonald"/>
                    <PostCard image={contohBg} logo={contohLogo} text="Hi Dog"/>
                    <PostCard image={contohBg} logo={contohLogo} text="mcdokdae"/>
                    <PostCard image={contohBg} logo={contohLogo} text="mcmekimeki"/>
                </div>
            </div>
        </div>
    );
}

export default Search;