import { create } from "zustand";
import { api } from "../lib/axios";
import emailjs from "@emailjs/browser";

export const useUsersStore = create((set, get) => ({
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
      console.log(otp);

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
