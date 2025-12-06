import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  sendMessage,
  deleteMessage,
  clearChat,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/get-messages", protectRoute, getMessages);

router.post("/send", protectRoute, sendMessage);

router.delete("/:id/", protectRoute, clearChat);

router.delete("/delete/:id", protectRoute, deleteMessage);

export default router;
