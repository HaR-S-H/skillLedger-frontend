import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
  // Let axios automatically set Content-Type based on data type
});


export default API;