import { User } from "../models/user.model.js";
import { Appointment } from "../models/Appointment.model.js";
import { HealthRecord } from "../models/HealthRecord.model.js";

export const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalDoctors = await User.countDocuments({ role: "DOCTOR" });
  const totalPatients = await User.countDocuments({ role: "PATIENT" });

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = await Appointment.countDocuments({
    date: { $gte: today }
  });

  const activeRecords = await HealthRecord.countDocuments({ status: "Active" });

  return res.json({
    success: true,
    data: {
      totalUsers,
      totalDoctors,
      totalPatients,
      todayAppointments,
      activeRecords
    }
  });
};
