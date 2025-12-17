import { Server } from "socket.io";
import {createServer} from "http";
import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
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
