import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserForSidebar,
  getMessages,
  sendMessage,
  getAllUser,
  getMsg,
  deleteMessage,
  newMsg,
  clearChat,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);

router.get("/all-users", protectRoute, getAllUser);

router.get("/:id", protectRoute, getMessages);

router.post("/check/:id", protectRoute, newMsg);

router.get("/:id1/:id2", protectRoute, getMsg);

router.post("/send/:id", protectRoute, sendMessage);

router.delete("/:id/", protectRoute, clearChat);

router.delete("/delete/:id", protectRoute, deleteMessage);

export default router;
