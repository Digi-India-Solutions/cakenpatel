import axios from "axios";

const serverURL = "https://api.cakenpetals.com";

// Axios instance
const api = axios.create({
  baseURL: serverURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach token automatically
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Service object
const FetchNodeServices = {
  serverURL,

  postData: async (url, body) => {
    try {
      const response = await api.post(`/${url}`, body);
      return response.data;
    } catch (error) {
      console.error("POST ERROR:", error.response?.data || error.message);
      return null;
    }
  },

  getData: async (url) => {
    try {
      const response = await api.get(`/${url}`);
      return response.data;
    } catch (error) {
      console.error("GET ERROR:", error.response?.data || error.message);
      return null;
    }
  },
};

export default FetchNodeServices;
