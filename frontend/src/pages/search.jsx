import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import poster3 from "../assets/poster3.svg";
import poster2 from "../assets/poster2.svg";
import poster1 from "../assets/poster1.svg";
import contohLogo from "../assets/logo_mcd.png";
import contohBg from "../assets/mcd.jpg";
import PostCard from "../components/postcard";
import RestoService from "../services/RestoService";

function Search() {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("");
  const [type, setType] = useState("");

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const filters = {
        search,
        minRating,
        type: type ? [type] : [],
      };

      const result = await RestoService.getRestaurants(currentPage, 3, filters);
      console.log("Fetched restaurants:", result);

      setRestaurants(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [currentPage, minRating, search]);

  return (
    <div className="flex flex-col my-10">
      
      {/* Banner Posters */}
      <div className="flex flex-wrap gap-10 w-full justify-center mb-12">
        {[poster2, poster1, poster3].map((poster, index) => (
          <motion.div
            key={index}
            className="w-1/3 sm:w-1/4 md:w-1/4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
          >
            <img src={poster} className="w-full" />
          </motion.div>
        ))}
      </div>

      {/* Today's Recommendation */}
      <div className="flex flex-col items-center">
      <div className="flex flex-row items-center justify-between w-full max-w-6xl px-4 font-semibold text-[#0D3B2E]">
          <p>Today's Recommendation</p>
          <a href="/" className="hover:underline text-sm sm:text-base">
            View All
          </a>
        </div>

        <div className="flex flex-wrap gap-6 justify-center sm:justify-start mt-5">
          {[contohBg, contohBg, contohBg].map((image, index) => (
            <PostCard
              key={index}
              image={image}
              title="McDonald"
              description="Fast food • Burgers • Fries"
            />
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-6 mt-10 w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            
            {/* Filter Sidebar */}
            <div className="flex flex-col w-full md:w-1/3 gap-4">
              {/* Search Input */}
              <div className="flex flex-col">
                <label htmlFor="search" className="text-lg font-semibold mb-1">
                  Find restaurant name
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search restaurant name..."
                  value={search}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearch(e.target.value);
                  }}
                  className="px-4 py-2 border rounded-lg w-full h-[42px]"
                />
              </div>

              {/* Rating Filter */}
              <div className="flex flex-col">
                <label htmlFor="rating" className="text-lg font-semibold mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="rating"
                    type="checkbox"
                    checked={minRating === "4"}
                    onChange={(e) => {
                      const newRating = e.target.checked ? "4" : "";
                      setMinRating(newRating);
                    }}
                    className="w-5 h-5 accent-green-700"
                  />
                  <label htmlFor="rating" className="text-md">
                    4 stars & above
                  </label>
                </div>
              </div>
            </div>

            {/* Restaurant List */}
            <div className="w-full md:w-2/3">
              {loading ? (
                <div className="text-center py-10">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {restaurants.map((resto, index) => (
                    <Link key={resto.id} to={`/food-list/${resto.id}`}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          opacity: { duration: 1, delay: index * 0.2 },
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 1.1 }}
                        className="border-transparent rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white flex flex-col h-full"
                      >
                        <img
                          src={resto.photo}
                          alt={resto.name}
                          className="h-40 w-full object-cover"
                        />
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold truncate">
                            {resto.name}
                          </h3>
                          <p className="text-sm mt-1">
                            ⭐ {resto.rating.toFixed(1)} • 🍽️ {resto.type}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-4 mt-10">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
