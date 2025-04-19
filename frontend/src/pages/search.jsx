import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import poster3 from "../assets/poster3.svg";
import poster2 from "../assets/poster2.svg";
import poster1 from "../assets/poster1.svg";
import contohLogo from "../assets/logo_mcd.png";
import contohBg from "../assets/mcd.jpg";
import PostCard from "../components/postcard";
import RestoService from "../service/RestoService";

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
        search, // Pencarian berdasarkan nama restoran
        minRating, // Rating minimal dari checkbox
        type: type ? [type] : [], // Filter berdasarkan tipe restoran, jika ada
      };

      // Memanggil API dengan parameter filter
      const result = await RestoService.getRestaurants(currentPage, 3, filters);
      console.log("Fetched restaurants:", result);

      // Menyimpan hasil restoran dan jumlah halaman total
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
  }, [currentPage, minRating]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRestaurants();
  };

  return (
    <div className="flex flex-col my-10">
      {/* Banner */}
      <div className="flex flex-row gap-10 w-full justify-center mb-12">
        <Link to="/">
          <img src={poster2} className="w-48" />
        </Link>
        <Link to="/">
          <img src={poster1} className="w-48" />
        </Link>
        <Link to="/">
          <img src={poster3} className="w-48" />
        </Link>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-130 font-semibold text-[#0D3B2E]">
          <p>Rekomendasi hari ini</p>
          <a href="/" className="hover:underline">
            Lihat semua
          </a>
        </div>
        {/* Post Card Showcase */}
        <div className="flex flex-row gap-6 justify-start mt-5">
          <PostCard
            image={contohBg}
            title="McDonald"
            description="Fast food • Burgers • Fries"
          />
          <PostCard
            image={contohBg}
            title="McDonald"
            description="Fast food • Burgers • Fries"
          />
          <PostCard
            image={contohBg}
            title="McDonald"
            description="Fast food • Burgers • Fries"
          />
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col gap-6 mt-10 w-full max-w-6xl mx-auto px-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row md:items-end gap-4 w-full"
          >
            {/* Search Input */}
            <div className="flex flex-col w-full">
              <label htmlFor="search" className="text-lg font-semibold mb-1">
                Find restaurant name
              </label>
              <input
                id="search"
                type="text"
                placeholder="Cari nama restoran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full h-[42px]"
              />
            </div>

            {/* Tombol Cari */}
            <div className="flex flex-col w-full md:w-1/8 pr-6">
              <label className="invisible">Cari</label>
              <button
                type="submit"
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 cursor-pointer w-full h-[42px]"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Filter Rating and Restaurant List */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Filter Rating */}
            <div className="flex flex-col w-full md:w-1/4">
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
                    setMinRating(newRating); // Update rating
                  }}
                  className="w-5 h-5 scale-80 accent-green-700"
                />
                <label htmlFor="rating" className="text-md">
                  4 stars & above
                </label>
              </div>
            </div>

            {/* Restaurant List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 w-full md:w-3/4">
              {restaurants.map((resto) => (
                <Link key={resto.id} to={`/food-list/${resto.id}`}>
                  <PostCard
                    image={resto.photo}
                    title={
                      <div className="truncate whitespace-nowrap overflow-hidden">
                        {resto.name}
                      </div> // Menggunakan Tailwind CSS untuk memotong teks
                    }
                    description={`⭐ ${resto.rating.toFixed(1)} • 🍽️ ${resto.type}`}
                  />
                </Link>
              ))}
            </div>
          </div>

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
  );
}

export default Search;
