import { create } from "zustand";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  isDeletingMsg: false,
  isClearingMsg: false,
  isMessageLoading: false,
  isSendingMessage: false,
  isConversationLoading: false,
  chatId: null,
  user: null,
  messages: {},
  conversations: [],
  setUser: (user) => {
    set({ user });
  },

  setChatId: (chat) => {
    set({ chatId: chat });
  },

  setMessages: async () => {
    try {
      set({ isMessageLoading: true });
      const res = await api.get(`/messages/get-all-messages`);
      const m = res.data;
      const chats = {};
      m.forEach((msg) => {
        const chatId = msg.chatId;
        if (!chats[chatId]) {
          chats[chatId] = [];
        }
        chats[chatId].push(msg);
      });
      set({ messages: chats });
      set({ isMessageLoading: false });
    } catch (error) {
      set({ isMessageLoading: false });
      console.log("Error in setMessages: ", error);
    }
  },

  setConversations: (msg) => {
    try {
      set({ isConversationLoading: true });
      const userId = get().user?._id?.toString();
      const updated = get().conversations.map((item) => {
        const itemChatId = (item._id || item.chatId)?.toString();
        const msgChatId = (msg.chatId?._id || msg.chatId)?.toString();
        if (itemChatId === msgChatId) {
          return {
            ...item,
            lastMessage: msg.text || "[Image]",
            lastMessageAt: msg.createdAt || new Date(),
          };
        }
        return item;
      });
      const sorted = updated.sort(
        (a, b) =>
          new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
      );
      set({ conversations: sorted });
      set({ isConversationLoading: false });
    } catch (error) {
      set({ isConversationLoading: false });
      console.log("Error in setConversation: ", error);
    }
  },

  getConversations: async () => {
    const res = await api.get("/users/conversations");

    await set({ conversations: res.data });
    return res.data;
  },

  initSocketListener: (socket, user) => {
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", async (msg) => {
      const chatId = (msg.chatId?._id || msg.chatId).toString();
      console.log("newMsg: ", msg);
      const ms = get().messages;

      const prev = ms[chatId] || [];
      const list = [...prev, msg];

      // Update Zustand
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: list,
        },
      }));
    });
  },

  getChatId: async (otherUser) => {
    try {
      const res = await api.post("/users/chatId", { otherUser: otherUser });
      set({ chatId: res.data });
      return res.data;
    } catch (error) {
      console.log("error in getUsers :", error.message);
      set({ chatId: null });
    }
  },

  // getMessage: async (userId) => {
  //   set({ isMessageLoading: true });
  //   try {
  //     const res = await api.get(`/messages/${userId}`);
  //     set({ messages: res.data });
  //   } catch (error) {
  //     console.log("Error in getMessages: ", error);
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isMessageLoading: false });
  //   }
  // },

  sendMessage: async (messageData) => {
    set({ isSendingMessage: true });
    try {
      const res = await api.post(`/messages/send`, messageData);
      const chatId = (messageData.chatId?._id || messageData.chatId).toString();
      const ms = get().messages;

      const prev = ms[chatId] || [];
      const list = [...prev, messageData];
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: list,
        },
      }));

      get().setConversations(messageData);
      return res.data;
    } catch (error) {
      console.log("Error in sendMessage: ", error);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  readChat: async (chat) => {
    try {
      const res = await api.post("/users/read", { chatId: chat._id });
      const conversations = get().conversations;

      const temp = conversations.filter((i) => i._id !== chat._id);
      const updatedChat = { ...chat, read: true };
      const updated = [...temp, updatedChat];
      const sorted = [...updated].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
      );
      set({ conversations: sorted });

      return res.data;
    } catch (error) {
      console.log("error in getUsers :", error.message);
      set({ chatId: null });
    }
  },

  deleteMessage: async (id, chatId) => {
    set({ isDeletingMsg: true });
    try {
      await api.delete(`/messages/delete/${id}`);
      toast.success("Message deleted");
      const messages = get().messages;
      const chat = messages[chatId];
      const updated = chat.filter((item) => item._id !== id);
      messages[chatId] = updated;
      set({ messages: messages });
    } catch (error) {
      console.log("Error in deleteMessage: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isDeletingMsg: false });
    }
  },

  clearMsg: async (id) => {
    set({ isClearingMsg: true });
    try {
      await api.delete(`/messages/${id}`);
      toast.success("Chat history cleared");
      set({ messages: [] });
    } catch (error) {
      console.log("Error in clearMsg: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isClearingMsg: false });
    }
  },
}));
