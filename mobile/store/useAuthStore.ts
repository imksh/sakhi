import { ToastAndroid } from "react-native";
import { create } from "zustand";
import { api } from "../utils/axios";
import io from "socket.io-client";
import { getData, save, remove } from "../utils/storage";

// const BASE_URL = "https://sakhi-wt7s.onrender.com";
const BASE_URL = "http://10.140.16.71:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const token = await getData("token");
      if (!token) return;

      const res = await api.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("error in checkAuth :", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  pushNotification: async (token) => {
    try {
      await api.post("/auth/subscribe", { expoToken: token });
    } catch (error) {
      console.log("error in sending notification token :", error);
    }
  },

  getAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const user = await getData("authUser");

      set({ authUser: user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("error in getAuth :", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    console.log(data);
    try {
      const res = await api.post("/auth/signup", data, {
        headers: {
          "X-Platform": "mobile",
        },
        withCredentials: true,
      });
      set({ authUser: res.data });
      ToastAndroid.show("Account created successfully", ToastAndroid.SHORT);
      return true;
    } catch (error) {
      console.log("error in signup :", error);
      ToastAndroid.show(
        error.response?.data?.message || "Something went wrong",
        ToastAndroid.SHORT
      );
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await api.post("/auth/verify-email", data);
      ToastAndroid.show(
        `Verification email sent on ${data?.email}`,
        ToastAndroid.SHORT
      );
      return true;
    } catch (error) {
      console.log("error in signup :", error);
      ToastAndroid.show(
        error.response.data?.message || "Something went wrong",
        ToastAndroid.SHORT
      );
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      set({ authUser: null });
      ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
      await remove("authUser");
      await remove("token");
      get().disconnectSocket();
    } catch (error) {
      console.log("error in logout :", error);
      ToastAndroid.show(error.response.data?.message, ToastAndroid.SHORT);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data });
      await save("authUser", res.data);

      ToastAndroid.show("Logged in successfully", ToastAndroid.SHORT);

      await save("token", res.data.token);
      get().connectSocket();
    } catch (error) {
      console.log("error in login :", error.message);
      ToastAndroid.show(
        error?.response?.data?.message || error.message || "An error occurred",
        ToastAndroid.SHORT
      );
    } finally {
      set({ isLoggingIng: false });
    }
  },

  checkAuthUser: async () => {
    const user = await getData("authUser");
    if (user) {
      set({ authUser: user });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const token = await getData("token");
      if (!token) return;
      const res = await api.put("/auth/update-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ authUser: res.data });
      ToastAndroid.show("Profle updated successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.log("error in updateProfile :", error);
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateVisibility: async (data) => {
    try {
      const token = await getData("token");
      if (!token) return;
      const res = await api.put("/auth/update-visibility", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ authUser: res.data });
      ToastAndroid.show("Profle updated successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.log("error in updatevisibility :", error);
      ToastAndroid.show("Profle updated Failed", ToastAndroid.SHORT);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) return;

    if (get().socket) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log(" Disconnected from socket:", socket.id);
    });

    set({ socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected manually");
    }
  },
}));
