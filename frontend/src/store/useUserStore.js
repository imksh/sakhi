import { create } from "zustand";
import { api } from "../lib/axios";
import emailjs from "@emailjs/browser";
import nacl from "tweetnacl";
import { decodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-util";

export const useUsersStore = create((set, get) => ({
  privateKey: "",
  keysReady: false,
  getKey: () => {
    const stored = localStorage.getItem("privateKey");

    if (!stored) {
      return false;
    }
    const decoded = decodeBase64(stored);

    set({ privateKey: decoded });
    set({ keysReady: true });
    return true;
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

  tempEmail: {},

  verifyEmail: async (email, name) => {
    try {
      const res = await api.post("/auth/check-email", { email });
      if (!res.data.message) {
        return { message: "Email already exists" };
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 65 * 1000;
      set((state) => ({
        tempEmail: {
          ...state.tempEmail,
          [email]: { otp, expires },
        },
      }));

      await emailjs.send(
        "service_l4l55xn",
        "template_jr95a0b",
        {
          email: email,
          name: name,
          passcode: otp,
        },
        "cTO9Hbp3yuxqV7Z1C"
      );

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  },
}));
