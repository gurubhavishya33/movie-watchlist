import axios from "axios";

const api = axios.create({
  baseURL: "https://movie-watchlist-backend-46h8.onrender.com/api",
});

export default api;