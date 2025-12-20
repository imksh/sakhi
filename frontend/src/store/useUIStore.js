import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  showMsgOption: "",
  setShowMsgOption: (val) => {
    set({ showMsgOption: val });
  },
}));
