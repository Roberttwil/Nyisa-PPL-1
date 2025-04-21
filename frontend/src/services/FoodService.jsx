import axios from 'axios';

// Set base URL untuk API
const API_URL = 'http://localhost:5000/api/foods';

const fetchFoods = async (page = 1, limit = 10, filters = {}) => {
    try {
        // Membuat query params dari filter
        const params = {
            page,
            limit,
            search: filters.search,
            type: filters.type,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            restaurant_id: filters.restaurant_id, // Menambahkan restaurant_id pada params
        };

        // Mengirimkan request ke API
        const response = await axios.get(`${API_URL}/cards`, { params });

        return response.data; // Mengembalikan data response
    } catch (error) {
        console.error('Error fetching foods:', error);
        throw error; // Mengeluarkan error jika gagal
    }
};

export default {
    fetchFoods,
};
