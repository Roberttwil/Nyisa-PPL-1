import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, getAuthHeader());
  return response.data.profile;
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, profileData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};

export const getTransactionHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/transactions`, getAuthHeader());
    return response.data.transactions;
  } catch (error) {
    console.error('Failed to fetch transaction history:', error);
    throw error;
  }
};

export const getLastTransactionFood = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/last-transaction-food`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.food_id;
};

