import { Router } from "express";
import {
  chatWithAI,
  getChatHistory,
  clearChatHistory
} from "../controllers/aiChat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/chat")
  .post(chatWithAI);

router.route("/history")
  .get(getChatHistory)
  .delete(clearChatHistory);

export default router;