import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

export const getAppointments = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let filter = {};

    if (role === "DOCTOR") {
      filter.doctor = _id;
    } else if (role === "PATIENT") {
      filter.patient = _id;
    }

    const appointments = await Appointment.find(filter)
      .populate("doctor", "name avatar specialty")
      .populate("patient", "name avatar")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor", "name avatar specialty qualification")
      .populate("patient", "name avatar dob gender bloodGroup");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "name avatar specialty")
      .populate("patient", "name avatar");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Time slot already booked" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("doctor", "name avatar specialty")
      .populate("patient", "name avatar");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "DOCTOR") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const consultationHours =
      doctor.consultationHours || { start: "09:00", end: "17:00" };

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["Scheduled", "Pending"] },
    });

    const availableSlots = [];
    const startTime = new Date(`${date}T${consultationHours.start}`);
    const endTime = new Date(`${date}T${consultationHours.end}`);

    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      const isBooked = bookedAppointments.some(
        (apt) => apt.time === timeString
      );

      if (!isBooked) {
        availableSlots.push(timeString);
      }

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

