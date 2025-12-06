import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUser, getUsers, chatId,getUserConversations } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/get-user", protectRoute, getUser);
router.post("/get-users", protectRoute, getUsers);
router.post("/chatId", protectRoute, chatId);
router.get("/conversations", protectRoute, getUserConversations);

export default router;
