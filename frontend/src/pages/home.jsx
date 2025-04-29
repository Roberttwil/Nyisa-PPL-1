import React from "react";
import { motion } from "framer-motion";
import pictt from "../assets/croissant.png";
import circle from "../assets/element1.svg";
import flowerz from "../assets/element2.svg";
import foodWaste from "../assets/food-waste.png"; // Import gambar food-waste

export default function Home() {
  return (
    <div className="relative flex flex-col items-center mt-10 mb-40 mx-auto overflow-hidden">
      {/* Background Elements */}
      <img
        src={flowerz}
        className="absolute right-10 sm:right-7 md:right-30 -z-50 top-5 w-44 sm:w-52 md:w-60"
        alt="Flower"
      />
      <img
        src={circle}
        className="absolute top-60 left-0 h-48 sm:h-60 md:h-75 z-[-1]"
        alt="Circle"
      />

      {/* Header Section */}
      <div className="flex items-center justify-center relative z-10">
        {/* Header Animation Kiri */}
        <motion.div
          className="flex flex-col items-end leading-9 text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D3B2E] -mr-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
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
          alt="Croissant"
          className="w-36 sm:w-44 md:w-52"
          initial={{ opacity: 0, y: "0px" }} // Awal posisi gambar di tengah dengan opacity 0 (transparan)
          animate={{
            opacity: 1, // Setelah animasi fade-in selesai, gambar menjadi sepenuhnya terlihat
            y: ["0px", "-20px", "0px"], // Gerakan naik turun
          }}
          transition={{
            opacity: { duration: 1, ease: "easeIn" }, // Fade-in selama 1 detik saat pertama kali muncul
            y: {
              duration: 2, // Durasi animasi naik turun
              repeat: Infinity, // Ulangi animasi terus menerus
              repeatType: "loop", // Jenis pengulangan tanpa henti
              ease: "easeInOut", // Transisi yang mulus untuk gerakan naik turun
            },
          }}
        />

        {/* Header Animation Kanan */}
        <motion.div
          className="flex flex-col leading-9 text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D3B2E] -ml-8"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <p>START</p>
          <p className="relative right-4">FOOD</p>
          <p>START</p>
          <p className="relative right-4">FOOD</p>
          <p>START</p>
        </motion.div>
      </div>

      {/* Punchline */}
      <motion.div
        className="mt-16 mb-20 px-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <p className="text-center font-semibold text-[#0D3B2E] text-sm sm:text-lg md:text-xl lg:text-2xl">
          Enjoy{" "}
          <span className="text-[#B2E2EC] font-bold">perfectly edible</span>{" "}
          surplus meals at{" "}
          <span className="text-[#ADD34C] font-bold">lower prices</span> while
          helping
        </p>
        <p className="text-center font-semibold text-[#0D3B2E] text-sm sm:text-lg md:text-xl lg:text-2xl">
          reduce food waste and build a more sustainable world
        </p>
      </motion.div>

      {/* Our Mission */}
      <motion.div
        className="mt-20 flex flex-col sm:flex-row items-center gap-10 bg-[#f4f5f2] px-8 py-10 rounded-2xl max-w-5xl shadow-md text-center md:text-left z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {/* Text Box */}
        <div className="sm:w-2/3 sm:px-4 md:px-6">
          <h2 className="text-2xl font-bold text-[#0D3B2E] mb-4">
            Our Mission
          </h2>
          <p className="text-[#3c574c] font-medium text-md sm:text-md md:text-lg">
            At <span className="text-[#ADD34C] font-bold">Nyisa</span>, our
            mission is to rescue surplus food that's still safe and delicious,
            making it available to everyone at affordable prices. We aim to
            reduce food waste and promote a greener future—one meal at a time.
          </p>
        </div>

        {/* Image Box */}
        <div className="sm:w-1/3 md:w-1/4 flex justify-center">
          <img
            src={foodWaste}
            alt="Food Waste"
            className="w-28 sm:w-32 md:w-full rounded-xl"
          />
        </div>
      </motion.div>
    </div>
  );
}
