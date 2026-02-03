import express from "express";
import {
  register,
  login,
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  updateProfile,
  guestLogin,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/guest-login", guestLogin);
router.put("/update-profile", protect, updateProfile);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, googleAuthSuccess);

export default router;