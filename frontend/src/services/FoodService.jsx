import axios from "axios";

// Set base URL untuk API
const API_URL = "http://localhost:5000/api/foods";

// Fetch food cards
const fetchFoods = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      search: filters.search,
      type: filters.type,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      restaurant_id: filters.restaurant_id,
    };

    const response = await axios.get(`${API_URL}/cards`, { params });

    return response.data;
  } catch (error) {
    console.error("Error fetching foods:", error);
    throw error;
  }
};

const addFood = async (foodData, photoFile = null) => {
  try {
    const token = localStorage.getItem("token");

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("name", foodData.name);
    formData.append("type", foodData.type);
    formData.append("price", foodData.price);
    // Only add promoPrice if it has a value
    if (foodData.promo_price && foodData.promo_price !== "") {
      formData.append("promo_price", foodData.promo_price);
    }
    formData.append("quantity", foodData.quantity);

    // Only add photo if it exists and is not null
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding food:", error);
    throw error;
  }
};

// Update food
// Updated updateFood method in FoodService.jsx
const updateFood = async (foodId, foodData, photoFile) => {
  try {
    const token = localStorage.getItem("token");

    // Validate required data
    if (!foodId) {
      throw new Error("Food ID is required for update");
    }

    // Create FormData object for update with file upload
    const formData = new FormData();
    
    // Ensure consistent data types (same as addFood)
    formData.append("name", String(foodData.name).trim());
    formData.append("type", String(foodData.type).trim());
    formData.append("price", parseInt(foodData.price)); // Changed from parseFloat to parseInt
    formData.append("quantity", parseInt(foodData.quantity));
    
    // Handle promo_price consistently
    if (foodData.promo_price && foodData.promo_price !== "" && foodData.promo_price !== null) {
      formData.append("promo_price", parseInt(foodData.promo_price)); // Changed from parseFloat to parseInt
    }

    // Only add photo if it exists and is a valid File object
    if (photoFile && photoFile instanceof File) {
      // Validate file size (max 2MB)
      if (photoFile.size > 2 * 1024 * 1024) {
        throw new Error("Photo size must be less than 2MB");
      }
      formData.append("photo", photoFile);
    }

    // Log the data being sent for debugging
    console.log("Updating food with ID:", foodId);
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios.put(`${API_URL}/${foodId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating food:", error);
    
    // Enhanced error logging
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request made but no response:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    
    throw error;
  }
};

// Delete food
const deleteFood = async (foodId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${API_URL}/${foodId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting food:", error);
    throw error;
  }
};

export default {
  fetchFoods,
  addFood,
  updateFood,
  deleteFood,
};
