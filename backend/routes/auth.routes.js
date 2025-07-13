import express from "express";
import { login, register, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Routes d'authentification
router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe);

export default router;
