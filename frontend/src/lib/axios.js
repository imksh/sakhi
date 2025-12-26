import axios from "axios";

export const api = axios.create({
  baseURL: "https://sakhi-wt7s.onrender.com/api",
  // baseURL: "http://localhost:5001/api",
  // baseURL: "http://10.61.54.71:5001/api",
  headers: {
    "x-platform": "web",
  },
  withCredentials: true,
});
