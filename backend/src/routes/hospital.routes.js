import { Router } from "express";
import { 
  getHospitals, 
  getHospitalById, 
  createHospital, 
  updateHospital, 
  deleteHospital 
} from "../controllers/hospital.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/")
  .get(getHospitals);

router.route("/:id")
  .get(getHospitalById);

// Protected routes (Admin only)
router.use(verifyJWT);

router.route("/")
  .post(verifyRole(['ADMIN']), createHospital);

router.route("/:id")
  .patch(verifyRole(['ADMIN']), updateHospital)
  .delete(verifyRole(['ADMIN']), deleteHospital);

export default router;