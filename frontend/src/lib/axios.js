import axios from "axios";

export const api = axios.create({
  baseURL: "https://sakhi-6j3g.onrender.com/api",
  // baseURL: "http://localhost:5001/api",
  withCredentials: true,
});