import axios from "axios";

export const api = axios.create({
  baseURL: "https://sakhi-wt7s.onrender.com/api",
  // baseURL: "http://10.140.16.71:5001/api",
  // baseURL: "https://sakhi-xgkj.onrender.com/api",
  withCredentials: true,
});
