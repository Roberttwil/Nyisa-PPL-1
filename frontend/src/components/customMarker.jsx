import { Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

const defaultIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const CustomMarker = ({ restaurant, activeId, setActiveId, navigate }) => {
    const map = useMap();
    const markerRef = useRef();

    useEffect(() => {
        if (activeId === restaurant.restaurant_id && markerRef.current) {
            markerRef.current.openPopup();
            map.flyTo([parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)], 17);
        }
    }, [activeId, restaurant, map]);

    return (
        <Marker
            icon={activeId === restaurant.restaurant_id ? greenIcon : defaultIcon}
            ref={markerRef}
            position={[parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)]}
            eventHandlers={{ click: () => setActiveId(restaurant.restaurant_id) }}
        >
            <Popup>
                <div className="min-w-[200px] min-h-[150px] max-w-xs bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">

                    {restaurant.photo ? (
                        <img
                            src={restaurant.photo}
                            alt={restaurant.name}
                            className="w-full h-24 object-cover"
                        />
                    ) : (
                        <div className="w-full h-24 bg-gray-800 flex items-center justify-center text-white text-xs">
                            No Image
                        </div>
                    )}


                    <div className="p-3">
                        <h5 className="text-sm font-bold text-green-900 truncate">
                            {restaurant.name}
                        </h5>
                        {/* <p className="text-s font-semibold text-yellow-600 mb-1">
                            {restaurant.rating === 0 ? "New" : `⭐ ${restaurant.rating.toFixed(1)}`}
                        </p> */}
                        <p className="text-s text-green-600 mb-2 truncate">
                            {restaurant.address || "Alamat tidak tersedia"}
                        </p>
                        <button
                            onClick={() => navigate(`/food-list/${restaurant.restaurant_id}`)}
                            className="relative w-full inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-green-100 rounded hover:bg-white group py-1.5 px-2.5"
                        >
                            <span className="w-full h-48 rounded bg-green-600 absolute bottom-0 left-0 translate-x-full translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0 ease-out duration-500 transition-all"></span>
                            <span className="relative w-full text-center text-green-700 transition-colors duration-300 ease-in-out group-hover:text-white">
                                Details
                            </span>
                        </button>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};

export default CustomMarker;
