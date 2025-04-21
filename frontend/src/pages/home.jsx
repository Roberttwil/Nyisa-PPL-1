import React from "react";
import { motion } from "framer-motion";
import pictt from "../assets/croissant.png";
import circle from "../assets/element1.svg";
import flowerz from "../assets/element2.svg";
import foodWaste from "../assets/food-waste.png"; // Import gambar food-waste

export default function Home() {
  return (
    <div className="mt-10 mb-40 flex flex-col items-center">
      {/* Header Animation */}
      <motion.div
        className="absolute flex flex-col items-end leading-9 text-4xl font-bold text-[#0D3B2E] left-108 top-58"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p>LETS</p>
        <p className="relative left-4">SAVING</p>
        <p>LETS</p>
        <p className="relative left-4">SAVING</p>
        <p>LETS</p>
      </motion.div>

      <motion.img
        src={pictt}
        className="w-55 mx-auto z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />

      <motion.div
        className="absolute flex flex-col leading-9 text-4xl font-bold text-[#0D3B2E] right-115 top-58"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p>START</p>
        <p className="relative right-4">FOOD</p>
        <p>START</p>
        <p className="relative right-4">FOOD</p>
        <p>START</p>
      </motion.div>

      <img src={flowerz} className="absolute right-75 -z-50 top-40 w-60" />
      <img src={circle} className="absolute top-60 left-0 h-80 z-[-1]" />

      {/* Punchline */}
      <motion.div
        className="mt-6 mb-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <p className="text-center font-semibold text-[#0D3B2E] text-lg md:text-2xl">
          Enjoy{" "}
          <span className="text-[#B2E2EC] font-bold">perfectly edible</span>{" "}
          surplus meals at{" "}
          <span className="text-[#ADD34C] font-bold">lower prices</span> while
          helping
        </p>
        <p className="text-center font-semibold text-[#0D3B2E] text-xl md:text-2xl">
          reduce food waste and build a more sustainable world
        </p>
      </motion.div>

      {/* Our Mission + Image */}
      <motion.div
        className="mt-20 flex flex-col md:flex-row items-center gap-10 bg-[#f4f5f2] px-8 py-10 rounded-2xl max-w-5xl shadow-md text-center md:text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {/* Text Box */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-[#0D3B2E] mb-4">Our Mission</h2>
          <p className="text-[#3c574c] font-medium text-lg">
            At <span className="text-[#ADD34C] font-bold">Nyisa</span>, our
            mission is to rescue surplus food that's still safe and delicious,
            making it available to everyone at affordable prices. We aim to reduce
            food waste and promote a greener future—one meal at a time.
          </p>
        </div>

        {/* Image Box */}
        <div className="md:w-1/4">
          <img src={foodWaste} alt="Food Waste" className="w-full rounded-xl" />
        </div>
      </motion.div>
    </div>
  );
}
