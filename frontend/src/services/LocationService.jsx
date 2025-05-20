const API_URL = "http://localhost:5000/api/restaurants";

export const getAllRestaurants = async (lat, lng) => {
  let url = `${API_URL}/all`;
  if (lat !== undefined && lng !== undefined) {
    url += `?lat=${lat}&lng=${lng}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch restaurants");
  return await res.json();
};
