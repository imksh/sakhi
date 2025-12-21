import axios from "axios";

export const api = axios.create({
  baseURL: "https://sakhi-xgkj.onrender.com/api",
  // baseURL: "http://localhost:5001/api",
  // baseURL: "http://10.140.16.71:5001/api",
  withCredentials: true,
});