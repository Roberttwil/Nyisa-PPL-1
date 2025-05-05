import axios from 'axios';

const API_URL = 'http://localhost:5000/api/restaurants';

const RestoService = {
  getRestaurants: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
      };

      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }

      if (filters.type && filters.type.length > 0) {
        params.type = filters.type.join(',');
      }

      if (filters.minRating) {
        params.minRating = filters.minRating;
      }

      const response = await axios.get(`${API_URL}/cards`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  getOwnerProfile: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/profile/owner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching owner profile:', error);
      throw error;
    }
  },

  updateOwnerProfile: async (formData, token) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating owner profile:', error);
      throw error;
    }
  },
};

export default RestoService;
