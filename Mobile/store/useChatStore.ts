import { create } from "zustand";
import { api } from "../utils/axios";
import { ToastAndroid } from "react-native";
import { getData, save } from "../utils/storage";

export const useChatStore = create((set, get) => ({
  isDeletingMsg: false,
  isClearingMsg: false,
  chatId: null,
  user: null,
  messages: {},
  conversations: [],
  setConversations: (msg) => {
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
      (a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
    );

    set({ conversations: sorted });
  },
  getConversations: async () => {
    const token = await getData("token");
    if (!token) return;
    const res = await api.get("/users/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ conversations: res.data });
    return res.data;
  },

  initSocketListener: (socket, user) => {
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", async (msg) => {
      const chatId = (msg.chatId?._id || msg.chatId).toString();

      // Save to AsyncStorage
      const cached = await getData(chatId);
      const list = [...(cached || []), msg];
      await save(chatId, list);

      // Update Zustand
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: list,
        },
      }));
      // if (msg.sender._id !== user?._id) {
      //   ToastAndroid.show(
      //     `New Message from ${msg.sender.name}`,
      //     ToastAndroid.SHORT
      //   );
      // }
    });
  },

  setUser: async (user) => {
    set({ user });
  },

  setChatId: (val) => {
    set({ chatId: val });
  },

  getChatId: async (otherUser) => {
    try {
      const token = await getData("token");
      if (!token) return;
      const res = await api.post(
        "/users/chatId",
        { otherUser: otherUser },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ chatId: res.data?._d });
      return res.data;
    } catch (error) {
      console.log("error in getUsers :", error.message);
      set({ chatId: null });
      ToastAndroid.show(
        error?.response?.data?.message || error.message || "An error occurred",
        ToastAndroid.SHORT
      );
    } finally {
    }
  },

  readChat: async (chat) => {
    try {
      const token = await getData("token");
      if (!token) return;
      const res = await api.post(
        "/users/read",
        { chatId: chat._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      ToastAndroid.show(
        error?.response?.data?.message || error.message || "An error occurred",
        ToastAndroid.SHORT
      );
    }
  },

  getMessages: async (chatId) => {
    set({ isMessageLoading: true });
    try {
      const token = await getData("token");
      if (!token) return;

      const res = await api.post(
        `/messages/get-messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        { chatId }
      );
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages: ", error);
      ToastAndroid.show(error.response?.data?.message, ToastAndroid.SHORT);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    set({ isSendingMessage: true });
    try {
      const token = await getData("token");
      if (!token) return;
      const res = await api.post(`/messages/send`, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const chatId = (messageData.chatId?._id || messageData.chatId).toString();
      const cached = await getData(chatId);
      const list = [...(cached || []), messageData];

      get().setConversations(messageData);

      await save(chatId, list);

      return res.data;
    } catch (error) {
      console.log("Error in sendMessage: ", error);
      ToastAndroid.show(error.response?.data?.message, ToastAndroid.SHORT);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  getUndelivered: async () => {
    try {
      const token = await getData("token");
      if (!token) return;
      const res = await api.get(`/messages/undelivered`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await Promise.all(
        res?.data?.map(async (msg) => {
          const chatId = (msg.chatId?._id || msg.chatId).toString();
          const cached = await getData(chatId);
          const list = [...(cached || []), msg];
          await save(chatId, list);
        })
      );

      return res.data;
    } catch (error) {
      console.log("Error in undelivered: ", error);
      ToastAndroid.show(error.response?.data?.message, ToastAndroid.SHORT);
    }
  },
}));
