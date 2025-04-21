import axios from 'axios';

const API_URL = 'http://localhost:5000/api/restaurants';

const RestoService = {
  getRestaurants: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
      };

      // Filter: search (by name)
      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }

      // Filter: type (multiple types, array)
      if (filters.type && filters.type.length > 0) {
        params.type = filters.type.join(',');
      }

      // Filter: minimum rating
      if (filters.minRating) {
        params.minRating = filters.minRating;
      }

      const response = await axios.get(`${API_URL}/cards`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }
};

export default RestoService;
