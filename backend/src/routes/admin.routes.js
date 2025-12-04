import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

const router = express.Router();

// Only authenticated admin can access
router.get("/stats", verifyJWT, requireAdmin, getAdminStats);

export default router;
