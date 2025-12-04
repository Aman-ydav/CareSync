import { Router } from "express";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/")
  .get(getAppointments)
  .post(createAppointment);

router.route("/slots")
  .get(getAvailableSlots);

router.route("/:id")
  .get(getAppointmentById)
  .patch(updateAppointment);

router.route("/:id/cancel")
  .patch(cancelAppointment);

export default router;