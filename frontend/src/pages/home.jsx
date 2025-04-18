import React from "react";
import pictt from "../assets/croissant.png"
import circle from "../assets/element1.svg"
import flowerz from "../assets/element2.svg"


export default function Home (){
    return(
        <div className="mt-10 mb-40 flex-row ">
             <div className="absolute flex flex-col items-end leading-9 text-4xl font-bold text-[#0D3B2E] left-108 top-58">
                <p>LETS</p>
                <p className="relative left-4">SAVING</p>
                <p>LETS</p>
                <p className="relative left-4">SAVING</p>
                <p>LETS</p>
            </div>

            <img src={pictt} className="w-50 mx-auto"></img>

            <div className="absolute flex flex-col leading-9 text-4xl font-bold text-[#0D3B2E] right-115 top-58">
                <p>START</p>
                <p className="relative right-4">FOOD</p>
                <p>START</p>
                <p className="relative right-4">FOOD</p>
                <p>START</p>
            </div>

            <img src={flowerz} className="absolute right-75 -z-50 top-40 w-60"></img>
            <img src={circle} className="absolute top-65 h-80"></img>
            <div className="">
                <p className="text-center font-semibold text-[#0D3B2E]">temukan makanan <span className="text-[#B2E2EC] font-bold">lezat</span> dengan harga <span className="text-[#ADD34C] font-bold">terjangkau</span> sambil</p>
                <p className="text-center font-semibold text-[#0D3B2E]">berkontribusi menciptakan lingkungan yang lebih</p>
                <p className="text-center font-semibold text-[#0D3B2E]">berkelanjutan</p>
            </div>
        </div>
    );
}