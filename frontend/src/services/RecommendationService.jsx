import axios from "axios";

const RECOMMEND_API = "http://127.0.0.1:8000/api/foods/recommend";

const getRecommendations = async (id) => {
  const res = await axios.get(`${RECOMMEND_API}/${id}`);
  return res.data;
};

export default {
  getRecommendations,
};