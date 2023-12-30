import axios from "axios";

const API_CALL = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default API_CALL;
