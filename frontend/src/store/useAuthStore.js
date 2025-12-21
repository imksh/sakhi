import { create } from "zustand";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";
import io from "socket.io-client";

// const BASE_URL = "https://sakhi-xgkj.onrender.com";
const BASE_URL = "https://sakhi-wt7s.onrender.com";
// const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("error in checkAuth :", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.log("error in signup :", error);
      toast.error(error.response.data?.message || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/verify-email", data);
      console.log(res.data);

      toast.success(`Verification email sent on ${data.email}`);
      return true;
    } catch (err) {
      console.error("verify error raw:", err);

      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Unknown error";

      console.error("verify error message:", msg);
      throw new Error(msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("error in logout :", error);
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await api.post("/auth/login", data, {
        headers: {
          "X-Platform": "web",
        },
      });
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log("error in login :", error);
      toast.error(
        error?.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      set({ isLoggingIng: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profle updated successfully");
    } catch (error) {
      console.log("error in updateProfile :", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateVisibility: async (data) => {
    try {
      const res = await api.put("/auth/update-visibility", data);
      set({ authUser: res.data });
      toast.success("Profle updated successfully");
    } catch (error) {
      console.log("error in updatevisibility :", error);
      toast.error("Profle updated Failed");
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
