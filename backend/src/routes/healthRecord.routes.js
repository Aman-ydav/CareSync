import express from "express";
import {
  getHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord
} from "../controllers/healthRecord.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/roleCheck.middleware.js";

const router = express.Router();

// GET all health records
router.get("/", verifyJWT, getHealthRecords);

// GET single record by ID
router.get("/:id", verifyJWT, getHealthRecordById);

// CREATE new record (Admin + Doctor)
router.post(
  "/",
  verifyJWT,
  allowRoles("ADMIN", "DOCTOR"),
  createHealthRecord
);

// UPDATE record (Admin + Doctor)
router.patch(
  "/:id",
  verifyJWT,
  allowRoles("ADMIN", "DOCTOR"),
  updateHealthRecord
);

// DELETE (Soft delete) record (Admin + Doctor)
router.delete(
  "/:id",
  verifyJWT,
  allowRoles("ADMIN", "DOCTOR"),
  deleteHealthRecord
);

export default router;
