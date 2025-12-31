import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_ENV === "production"
      ? "https://sakhi-wt7s.onrender.com/api"
      : "http://localhost:5001/api",
  headers: {
    "x-platform": "web",
  },
  withCredentials: true,
});
