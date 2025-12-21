import { ToastAndroid } from "react-native";
import { create } from "zustand";
import { api } from "../utils/axios";
import { getData, save, remove } from "../utils/storage";

export const useUsersStore = create((set, get) => ({
  getUser: async (data) => {
    set({ isLoggingIng: true });
    try {
      const token = await getData("token");
      if (!token) return;
      const res = await api.post(
        "/users/get-user",
        { val: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log("error in getUser :", error.message);
      ToastAndroid.show(
        error?.response?.data?.message || error.message || "An error occurred",
        ToastAndroid.SHORT
      );
    } finally {
      set({ isLoggingIng: false });
    }
  },
  getUsers: async (data) => {
    try {
      const token = await getData("token");
      if (!token) return;
      const res = await api.post(
        "/users/get-users",
        { val: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return res.data;
    } catch (error) {
      console.log("error in getUsers :", error.message);
      ToastAndroid.show(
        error?.response?.data?.message || error.message || "An error occurred",
        ToastAndroid.SHORT
      );
    } finally {
    }
  },
}));
