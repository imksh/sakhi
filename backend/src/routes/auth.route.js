import express from "express";
import { signup, logout, login,verifyEmail,subscribe } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { updateProfile } from "../controllers/auth.controller.js";
import { updateVisibility } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/signup", signup);

router.post("/verify-email", verifyEmail);

router.post("/login", login);

router.post("/logout", logout);

router.post("/subscribe",protectRoute, subscribe);

router.put("/update-profile",protectRoute,updateProfile);

router.put("/update-visibility",protectRoute,updateVisibility);

router.get("/check",protectRoute,checkAuth)

export default router;