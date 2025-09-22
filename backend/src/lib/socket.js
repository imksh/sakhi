import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://imksh-sakhi.netlify.app",
    credentials: true,
  },
});

const userSocketMap = {};

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};
export { io, server, app,getReceiverSocketId };
