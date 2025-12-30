import { create } from "zustand";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";
import nacl from "tweetnacl";
import { decodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-util";
import { useAuthStore } from "./useAuthStore";
import { useUsersStore } from "./useUserStore";

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
      const plain = get().decryptMessage(
        useUsersStore.getState().privateKey,
        get().user?.publicKey,
        msg.nonce,
        msg.text,
      );

      console.log(msg.nonce);

      const updated = get().conversations.map((item) => {
        const itemChatId = (item._id || item.chatId)?.toString();
        const msgChatId = (msg.chatId?._id || msg.chatId)?.toString();
        if (itemChatId === msgChatId) {
          return {
            ...item,
            lastMessage: plain || "[Image]",
            lastMessageAt: msg.createdAt || new Date(),
            nonce: msg.nonce,
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

    const updated = await res.data?.map((chat) => {
      const cipher = chat.lastMessage;
      const other = chat.members.find(
        (m) => m._id !== useAuthStore.getState().authUser?._id
      );
      try {
        const plain = get().decryptMessage(
          useUsersStore.getState().privateKey,
          other.publicKey,
          chat.nonce,
          cipher
        );

        return { ...chat, lastMessage: plain };
      } catch (error) {
        // console.log("error in decrypting conversation");
        return chat;
      }
    });

    await set({ conversations: updated });
    return updated;
  },

  initSocketListener: (socket, user) => {
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", async (msg) => {
      const chatId = (msg.chatId?._id || msg.chatId).toString();
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

  sendMessage: async (messageData) => {
    set({ isSendingMessage: true });
    try {
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

      const res = await api.post(`/messages/send`, messageData);
      get().setConversations(messageData);
      return res.data;
    } catch (error) {
      console.log("Error in sendMessage: ", error);
      const chatId = (messageData.chatId?._id || messageData.chatId).toString();
      const ms = get().messages;
      const prev = ms[chatId] || [];
      const list = prev.filter((m) => m._id !== messageData._id);
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: list,
        },
      }));
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

  encryptMessage: (myPrivateKey, theirPub, message) => {
    try {
      let theirPublicKey = decodeBase64(theirPub);

      const nonce = nacl.randomBytes(24);

      const cipher = nacl.box(
        decodeUTF8(message),
        nonce,
        theirPublicKey,
        myPrivateKey
      );

      

      return {
        nonce: encodeBase64(nonce),
        cipher: encodeBase64(cipher),
      };
    } catch (error) {
      console.log("Error in Encrypting: ", error);
      return {
        nonce: "",
        cipher: message,
      };
    }
  },

  decryptMessage: (myPrivateKey, theirPub, nonce, cipher) => {
    try {
      const theirPublicKey = decodeBase64(theirPub);
      const plain = nacl.box.open(
        decodeBase64(cipher),
        decodeBase64(nonce),
        theirPublicKey,
        myPrivateKey
      );

      

      if (!plain) return "[failed to decrypt]";
      return new TextDecoder().decode(plain);
    } catch (error) {
      console.log("Error in Decrypting: ", error);
      return cipher;
    }
  },
}));
