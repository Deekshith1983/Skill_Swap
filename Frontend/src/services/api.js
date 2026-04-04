import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

// ✅ JWT TOKEN AUTO ATTACH
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
