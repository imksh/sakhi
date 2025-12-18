import { create } from "zustand";
import { api } from "../lib/axios";

export const useUsersStore = create((set, get) => ({
  showNewChat: false,
  setShowNewChat: (val) => {
    set({ showNewChat: val });
  },
  getUser: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await api.post("/users/get-user", { val: data });
      return res.data;
    } catch (error) {
      console.log("error in getUser :", error.message);
    } finally {
      set({ isLoggingIng: false });
    }
  },
  getUsers: async (data) => {
    try {
      const res = await api.post("/users/get-users", { val: data });
      return res.data;
    } catch (error) {
      console.log("error in getUsers :", error.message);
    }
  },
}));
