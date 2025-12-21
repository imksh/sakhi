import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  showMsgOption: "",
  showNewChat: false,
  showOption: false,
  setShowOption: (val) => {
    set({ showOption: val });
  },
  setShowNewChat: (val) => {
    set({ showOption: val });
  },
  setShowMsgOption: (val) => {
    set({ showMsgOption: val });
  },
}));
