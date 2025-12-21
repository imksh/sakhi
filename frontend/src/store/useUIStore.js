import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  showMsgOption: "",
  showNewChat: false,
  showOption:false, 
  setShowOption: (val) => {
    set({ showOption: val });
  },
  setShowNewChat: (val) => {
    set({ showNewChat: val });
  },
  setShowMsgOption: (val) => {
    set({ showMsgOption: val });
  },
}));
