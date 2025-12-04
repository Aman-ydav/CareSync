import { Router } from "express";
import {
  getHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord
} from "../controllers/healthRecord.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/")
  .get(getHealthRecords)
  .post(verifyRole(['DOCTOR', 'ADMIN']), createHealthRecord);

router.route("/:id")
  .get(getHealthRecordById)
  .patch(verifyRole(['DOCTOR', 'ADMIN']), updateHealthRecord)
  .delete(verifyRole(['DOCTOR', 'ADMIN']), deleteHealthRecord);

export default router;