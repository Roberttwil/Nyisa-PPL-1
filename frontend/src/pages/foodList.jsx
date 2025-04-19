import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Untuk mengambil restoId dari URL
import FoodService from '../service/FoodService';
import PostCard from '../components/postcard'; // Pastikan path sesuai

const FoodList = () => {
    const { restoId } = useParams(); // Mengambil restoId dari URL params
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        minPrice: '',
        maxPrice: ''
    });

    const fetchFoodData = async (page) => {
        setLoading(true);
        try {
            // Kirimkan restoId sebagai parameter dalam query
            const data = await FoodService.fetchFoods(page, 15, {
                ...filters,
                restaurant_id: restoId, // Menambahkan restoId untuk memfilter berdasarkan restoran
            });
            setFoods(data.data); // Menyimpan makanan yang didapatkan
        } catch (error) {
            console.error('Error fetching food data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (restoId) {
            fetchFoodData(1); // Hanya fetch data makanan berdasarkan restoId
        }
    }, [filters, restoId]); // Akan dipanggil jika filters atau restoId berubah

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Food List</h1>

            {/* Filter/Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search by name"
                    className="w-full md:w-1/2 px-4 py-2 border rounded-lg"
                />
            </div>

            {/* Food Cards */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {foods.length > 0 ? (
                        foods.map((food) => (
                            <PostCard
                                key={food.id}
                                image={food.photo} // Pastikan data `image` ada
                                title={food.name}
                                description={
                                    <>
                                        <p>Type: {food.type}</p>
                                        <p>Price: ${food.price}</p>
                                        <p>Quantity: {food.quantity}</p>
                                    </>
                                }
                            />
                        ))
                    ) : (
                        <p>No food found for this restaurant</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FoodList;
