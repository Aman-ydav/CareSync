import express from "express";
import { chatWithAI, getChatHistory } from "../controllers/aiChat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", verifyJWT, chatWithAI);
router.get("/chat/history", verifyJWT, getChatHistory);

export default router;
