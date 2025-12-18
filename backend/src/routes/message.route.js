import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  sendMessage,
  deleteMessage,
  clearChat,
  undelivered,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/get-messages", protectRoute, getMessages);

router.post("/send", protectRoute, sendMessage);
router.get("/undelivered", protectRoute, undelivered);

router.delete("/:id/", protectRoute, clearChat);

router.delete("/delete/:id", protectRoute, deleteMessage);

export default router;
