import axios from 'axios';

const API_URL = 'http://localhost:5000/api/upload';

export const uploadUserPhoto = async (photoFile, token) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await axios.put(`${API_URL}/user-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading user photo:', error);
    throw error.response?.data || { message: 'Upload failed' };
  }
};

export const uploadRestaurantPhoto = async (photoFile, token) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await axios.put(`${API_URL}/restaurant-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading restaurant photo:', error);
    throw error.response?.data || { message: 'Upload failed' };
  }
};
