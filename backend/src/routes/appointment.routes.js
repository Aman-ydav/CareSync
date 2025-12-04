import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots
} from "../controllers/appointment.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/roleCheck.middleware.js";

const router = express.Router();

// Get all appointments
router.get("/", verifyJWT, getAppointments);

// Get single appointment
router.get("/:id", verifyJWT, getAppointmentById);

// Create appointment
router.post("/", verifyJWT, createAppointment);

// Update appointment (time, status, notes, etc)
router.patch(
  "/:id",
  verifyJWT,
  allowRoles("ADMIN", "DOCTOR", "PATIENT"),
  updateAppointment
);

// Cancel appointment
router.post("/:id/cancel", verifyJWT, cancelAppointment);

// Get available slots
router.get("/doctor/slots/available", verifyJWT, getAvailableSlots);

export default router;
