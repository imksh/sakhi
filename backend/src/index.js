import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";
import messageRoutes from "./routes/message.route.js";
import publicRoutes from "./routes/public.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const port = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://imksh-sakhi.netlify.app",
      "http://10.140.16.71:5173",
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/public", publicRoutes);
app.use("/api/users", usersRoutes);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
  connectDB();
});
