import express from "express";
import {
  chatWithAI,
  getChatHistory,
  clearChatHistory,
} from "../controllers/aiChat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", verifyJWT, chatWithAI);
router.get("/history", verifyJWT, getChatHistory);
router.delete("/history", verifyJWT, clearChatHistory);

export default router;
