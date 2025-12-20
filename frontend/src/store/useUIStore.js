import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  showMsgOption: "",
  showNewChat: false,
  setShowNewChat: (val) => {
    set({ showNewChat: val });
  },
  setShowMsgOption: (val) => {
    set({ showMsgOption: val });
  },
}));
