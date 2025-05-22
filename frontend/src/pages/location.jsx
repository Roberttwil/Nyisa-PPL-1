import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../services/LocationService";
import CustomMarker from "../components/customMarker";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const Location = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeId, setActiveId] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                getAllRestaurants(latitude, longitude)
                    .then((data) => {
                        setRestaurants(data);
                        setTimeout(() => {
                            if (mapRef.current) {
                                mapRef.current.flyTo([latitude, longitude], 15);
                            }
                        }, 500);
                    })
                    .catch((err) => console.error("Failed to fetch restaurants:", err));
            },
            (err) => {
                console.warn("Lokasi tidak diizinkan:", err.message);
                getAllRestaurants()
                    .then((data) => setRestaurants(data))
                    .catch((err) => console.error("Failed to fetch restaurants:", err));
            }
        );
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const filteredRestaurants = restaurants
        .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
  {/* Left side list */}
  <div className="z-30 w-full md:w-2/5 lg:w-1/3 xl:max-w-md bg-white h-[50vh] md:h-full overflow-y-auto shadow-2xl md:pb-20 pr-2">
    {/* Header + Search */}
    <h2 className="text-xl text-green-900 font-bold mt-4 mb-4 px-4">Closest Restaurants</h2>
    <input
      type="text"
      placeholder="Search Restaurant"
      className="w-full mb-4 p-2 mx-4 border border-green-700 rounded text-green-800 opacity-70 transition-all duration-300 hover:bg-green-50 focus:bg-green-50 focus:border-green-600 focus:outline-none active:border-green-600"
      style={{ width: 'calc(100% - 2rem)' }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {/* Resto List */}
    <div className="px-4">
      {filteredRestaurants.map((r) => (
        <div
          key={r.restaurant_id}
          className={`mb-2 p-2 rounded cursor-pointer transition-all duration-400 hover:bg-green-50 ${
            activeId === r.restaurant_id ? "bg-green-50" : "bg-white"
          }`}
          onClick={() => setActiveId(r.restaurant_id)}
          onDoubleClick={() => navigate(`/food-list/${r.restaurant_id}`)}
        >
            <div className="flex items-center">
              <div className="shrink-0 w-14 h-14 rounded overflow-hidden">
                {r.photo ? (
                  <img
                    className="w-full h-full object-cover"
                    src={r.photo}
                    alt={r.name}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 ms-4">
                <p className="text-md font-bold text-green-900">{r.name}</p>
                <p className="text-sm text-green-800 truncate opacity-80">
                  {r.address || "Alamat tidak tersedia"}
                </p>
                {r.distance && (
                  <p className="text-xs text-green-800 opacity-70">{r.distance.toFixed(2)} km</p>
                )}
              </div>
              <div className="inline-flex items-center text-base font-semibold text-yellow-500">
                {r.rating === 0 || r.rating === null || r.rating === undefined ? (
                  <span className="text-green-600 font-medium">New</span>
                ) : (
                  <>⭐ {r.rating.toFixed(1)}</>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>


        {/* Right side map */}
        <div className="z-10 w-full md:w-2/3 h-[50vh] md:h-full">
            <MapContainer
                center={[-6.9, 107.7]}
                zoom={15}
                zoomControl={false}
                className="h-full w-full"
                whenCreated={(map) => (mapRef.current = map)}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredRestaurants.map((r) => (
                    <CustomMarker
                        key={r.restaurant_id}
                        restaurant={r}
                        activeId={activeId}
                        setActiveId={setActiveId}
                        navigate={navigate}
                    />
                ))}
            </MapContainer>
        </div>
    </div>
);

};

export default Location;
