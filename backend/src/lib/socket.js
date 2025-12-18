import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://10.140.16.71:5173",
      "https://imksh-sakhi.netlify.app",
    ],
    credentials: true,
  },
});
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("🔥 New Socket Connected:", socket.id);
  console.log("User ID:", socket.handshake.query.userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

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

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const getReceiverSocketId = (userId) => userSocketMap[userId];

export { io, server, app, getReceiverSocketId, userSocketMap };
