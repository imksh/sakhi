import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://10.61.54.71:5173",
      "https://imksh-sakhi.netlify.app",
    ],
    credentials: true,
  },
});
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sync", async ({ userId }) => {
    const undelivered = await Message.find({
      receiver: userId,
      deliveredAt: null,
    }).populate("sender");

    socket.emit("missedMessages", undelivered);

    const ids = undelivered.map((m) => m._id);
    if (ids.length) {
      await Message.updateMany(
        { _id: { $in: ids } },
        { deliveredAt: new Date() }
      );
    }
  });

  socket.on("markAsRead", async ({ chatId, senderId }) => {
    const readerId = socket.handshake.auth.userId;

    const senderSockets = userSocketMap[senderId?.toString()];

    if (senderSockets) {
      for (const socketId of senderSockets) {
        io.to(socketId).emit("readMessage", {
          chatId,
          readerId,
        });
      }
    }
  });

  socket.on("isTyping", async ({ chatId, userId, status }) => {
    const sender = socket.handshake.auth.userId;

    const receiverSockets = userSocketMap[userId?.toString()];

    if (receiverSockets) {
      for (const socketId of receiverSockets) {
        io.to(socketId).emit("handleTyping", {
          chatId,
          sender,
          status,
        });
      }
    }
  });

  socket.on("disconnect", async () => {
    if (!userId) return;

    userSocketMap[userId].delete(socket.id);

    await User.updateOne(
      { _id: userId },
      { $set: { lastSeen: new Date().toISOString() } }
    );
    io.emit("lastSeen", {
      userId,
      lastSeen: new Date().toISOString(),
    });
    io.emit("lastSeen", { userId, lastSeen: new Date() });

    if (userSocketMap[userId]?.size === 0) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const getReceiverSocketIds = (userId) =>
  userSocketMap[userId] ? Array.from(userSocketMap[userId]) : [];

export { io, server, app, getReceiverSocketIds, userSocketMap };
