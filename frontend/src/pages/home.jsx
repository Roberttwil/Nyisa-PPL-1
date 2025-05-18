import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import pictt from "../assets/croissant.png";
import circle from "../assets/element1.svg";
import flowerz from "../assets/element2.svg";
import foodWaste from "../assets/food-waste.png";
import photo from "../assets/robert.jpg";

export default function Home() {
  const punchlineRef = useRef(null);
  const missionRef = useRef(null);
  const testimonialRef = useRef(null);

  const punchlineInView = useInView(punchlineRef, { once: false });
  const missionInView = useInView(missionRef, { once: false });
  const testimonialInView = useInView(testimonialRef, { once: false });

  const testimonials = [
    {
      name: "Robert",
      quote:
        "Nyisa helped me save money while contributing to a great cause. Love it!",
      rating: 5,
      image: photo,
    },
    {
      name: "Andrew",
      quote:
        "This wesbite has been really helpful. The food is delicious, affordable, and it helps save the planet!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      name: "Clara",
      quote:
        "A wonderful initiative! The website is easy to use and the meals are always good.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      name: "Edward",
      quote:
        "The food is of great quality and the service is excellent. Highly recommended!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/37.jpg",
    },
  ];

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
      <div className="flex items-center justify-center relative mr-3 md:mr-10">
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

        {/* Gambar */}
        <motion.img
          src={pictt}
          alt="Croissant"
          className="w-40 sm:w-44 md:w-52"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: ["0px", "-20px", "0px"],
          }}
          transition={{
            opacity: { duration: 1 },
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
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
        ref={punchlineRef}
        className="mt-16 mb-20 px-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={punchlineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1 }}
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
        ref={missionRef}
        className="mt-20 flex flex-col sm:flex-row items-center gap-10 bg-[#f4f5f2] px-8 py-10 rounded-2xl max-w-5xl shadow-md text-center md:text-left z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1 }}
      >
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
        <div className="sm:w-1/3 md:w-1/4 flex justify-center">
          <img
            src={foodWaste}
            alt="Food Waste"
            className="w-28 sm:w-32 md:w-full rounded-xl"
          />
        </div>
      </motion.div>

      {/* Why Must Use Nyisa Section */}
      <motion.div
        className="mt-40 w-full max-w-5xl px-4 sm:px-6 lg:px-8 z-10" // Increased margin-top to mt-40
        initial={{ opacity: 0, y: 40 }} // Initial animation state
        whileInView={{ opacity: 1, y: 0 }} // Animation when in view
        viewport={{ once: false }} // Repeat animation on re-entry
        transition={{ duration: 1 }} // Duration of animation
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0D3B2E] mb-10">
          Why Must Use <span className="text-[#ADD34C]">Nyisa?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-[#e0e0e0] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-[#0D3B2E] mb-2">
              Save Money
            </h3>
            <p className="text-[#3c574c] text-sm">
              Get delicious meals at a fraction of the price by buying surplus
              food that's still perfectly edible.
            </p>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-[#e0e0e0] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-[#0D3B2E] mb-2">
              Reduce Waste
            </h3>
            <p className="text-[#3c574c] text-sm">
              Contribute to minimizing food waste and help local businesses
              manage their surplus efficiently.
            </p>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-[#e0e0e0] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-[#0D3B2E] mb-2">
              Support Sustainability
            </h3>
            <p className="text-[#3c574c] text-sm">
              Join the movement towards a greener planet through conscious food
              choices and sustainable actions.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        ref={testimonialRef}
        className="mt-40 w-full max-w-6xl px-4 sm:px-6 lg:px-8 z-10" // Increased margin-top to mt-40
        initial={{ opacity: 0, y: 40 }}
        animate={
          testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
        }
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0D3B2E] mb-10">
          What Our Users Say
        </h2>
        <div className="grid gap-8 gap-y-15 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 pt-10">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="relative bg-white rounded-xl pt-12 pb-6 px-6 flex flex-col justify-between h-full border border-[#e0e0e0]"
              initial={{ opacity: 0, y: 20 }}
              animate={
                testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
              <div className="mt-6 text-yellow-400 text-lg text-center">
                {"⭐".repeat(testimonial.rating)}
                {"☆".repeat(5 - testimonial.rating)}
              </div>
              <p className="text-[#3c574c] font-medium text-base text-left mt-4">
                “{testimonial.quote}”
              </p>
              <div className="text-right mt-4 text-sm font-semibold text-[#0D3B2E]">
                — {testimonial.name}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Being Our Partner Section */}
      <motion.div
        className="mt-40 w-full max-w-5xl px-4 sm:px-6 lg:px-8 z-10"
        initial={{ opacity: 0, y: 40 }} // Initial animation state
        whileInView={{ opacity: 1, y: 0 }} // Animation when in view
        viewport={{ once: false }} // Repeat animation on re-entry
        transition={{ duration: 1 }} // Duration of animation
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0D3B2E] mb-10">
          Being Our <span className="text-[#ADD34C]">Partner</span>
        </h2>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e0e0e0]">
          <p className="text-[#3c574c] text-sm sm:text-md md:text-lg text-center mb-8">
            Join us in the fight against food waste and be a part of something
            greater. By becoming our partner, you’ll help provide delicious
            meals to those who need them while contributing to a greener, more
            sustainable future.
          </p>
          <div className="flex justify-center">
            <motion.a
              href="/partner"
              className="bg-[#ADD34C] text-white font-semibold text-lg py-3 px-8 rounded-xl shadow-lg hover:bg-[#8d9e37] transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
            >
              Become a Partner
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
