import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import poster3 from "../assets/poster3.svg";
import poster2 from "../assets/poster2.svg";
import poster1 from "../assets/poster1.svg";
import RestoService from "../services/RestoService";
import RecommendationService from "../services/RecommendationService";
import { getLastTransactionFood } from "../services/UserService";

function Search() {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationPage, setRecommendationPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("");
  const [type, setType] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "");
    setIsLoggedIn(storedRole === "user");
  }, []);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const role = localStorage.getItem("role");
        if (role === "user") {
          const last = await getLastTransactionFood();
          const foodId = last.food_id;

          const recResponse = await axios.get(
            `http://localhost:8000/api/foods/recommend/${foodId}`
          );
          setRecommendations(recResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch recommendation:", err);
      }
    };

    fetchRecommendation();
  }, []);

  const getItemsPerPage = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  };

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      setRecommendationPage(0);
      setCurrentPage(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const maxPage = Math.ceil(recommendations.length / itemsPerPage);
    if (recommendationPage >= maxPage) {
      setRecommendationPage(0);
    }
  }, [itemsPerPage, recommendations]);

  useEffect(() => {
    const maxPage = totalPages;
    if (currentPage > maxPage) {
      setCurrentPage(1);
    }
  }, [itemsPerPage, totalPages, currentPage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRecommendationPage(
        (prev) => (prev + 1) % Math.ceil(recommendations.length / itemsPerPage)
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [recommendations, itemsPerPage]);


  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const filters = {
        search,
        minRating,
        type: type ? [type] : [],
      };

      const result = await RestoService.getRestaurants(
        currentPage,
        itemsPerPage,
        filters
      );
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
  }, [currentPage, minRating, search, itemsPerPage]);

  const handleNextRecommendation = () => {
    setRecommendationPage(
      (prev) => (prev + 1) % Math.ceil(recommendations.length / itemsPerPage)
    );
  };

  const handlePrevRecommendation = () => {
    setRecommendationPage(
      (prev) =>
        (prev - 1 + Math.ceil(recommendations.length / itemsPerPage)) %
        Math.ceil(recommendations.length / itemsPerPage)
    );
  };

  const currentRecommendations = recommendations.slice(
    recommendationPage * itemsPerPage,
    recommendationPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="flex flex-col my-10">
      {/* Posters */}
      <div className="flex flex-wrap gap-10 w-full justify-center mb-12">
        {[poster2, poster1, poster3].map((poster, index) => (
          <motion.div
            key={index}
            className="w-1/3 sm:w-1/4 md:w-1/4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
          >
            <img src={poster} className="w-full" alt={`Poster ${index + 1}`} />
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      {isLoggedIn && recommendations.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center justify-between w-full max-w-6xl px-4 font-semibold text-[#0D3B2E] text-lg mb-4">
            <p>Today's Recommendation</p>
          </div>

          <div className="relative w-full px-4 max-w-6xl mx-auto">
            <div className="relative flex items-center justify-center">
              <button
                onClick={handlePrevRecommendation}
                className="absolute left-0 z-10 p-2 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              <div className="overflow-hidden w-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={recommendationPage}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap gap-6 justify-center px-4 py-6"
                  >
                    {currentRecommendations.map((item) => (
                      <div
                        key={item.id || item.name}
                        className="flex-shrink-0 w-full sm:w-[48%] md:w-[30%] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5"
                      >
                        <div className="mb-3">
                          <h3 className="text-xl font-bold text-gray-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 italic">
                            {item.type}
                          </p>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p className="text-lg font-semibold text-green-600">
                            Rp {item.price.toLocaleString()}
                          </p>
                          <p className="text-yellow-500">
                            ⭐ {item.rating.toFixed(1)}
                          </p>
                          <p className="text-gray-600">
                            Restoran:{" "}
                            <span className="font-medium">
                              {item.restaurant}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={handleNextRecommendation}
                className="absolute right-0 z-10 p-2 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Dots */}
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({
                length: Math.ceil(recommendations.length / itemsPerPage),
              }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === recommendationPage
                    ? "bg-green-600"
                    : "bg-gray-300"
                    }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col gap-6 mt-10 w-full max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="flex flex-col w-full md:w-1/3 gap-4">
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
  );
}

export default Search;
