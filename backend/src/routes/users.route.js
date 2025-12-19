import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUser,
  getUsers,
  chatId,
  getUserConversations,
  readConversations,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/get-user", protectRoute, getUser);
router.post("/get-users", protectRoute, getUsers);
router.post("/read", protectRoute, readConversations);
router.post("/chatId", protectRoute, chatId);
router.get("/conversations", protectRoute, getUserConversations);


export default router;
