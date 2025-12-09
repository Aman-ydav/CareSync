import { Router } from "express";
import  { verifyJWT }   from "../middlewares/auth.middleware.js";
import { improveText } from "../controllers/aiImprove.controller.js";

const router = Router();

router.post("/improve", verifyJWT, improveText);

export default router;
