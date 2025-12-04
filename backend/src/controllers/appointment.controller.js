import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Appointment } from "../models/Appointment.model.js";
import { User } from "../models/user.model.js";

const getAppointments = asyncHandler(async (req, res) => {
  // if no user found from JWT middleware
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized"));
  }

  const { role, _id: userId } = req.user;
  const {
    status,
    startDate,
    endDate,
    consultationType,
    page = 1,
    limit = 20,
  } = req.query;

  const skip = (page - 1) * limit;

  let filter = {};

  // Role-based access
  if (role === "DOCTOR") {
    filter.doctor = userId;
  }
  if (role === "PATIENT") {
    filter.patient = userId;
  }
  // admin sees all (no filter)

  // Basic filters
  if (status) {
    filter.status = status;
  }
  if (consultationType) {
    filter.consultationType = consultationType;
  }

  // Date filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate("doctor", "fullName avatar specialty qualification")
      .populate("patient", "fullName avatar dob gender bloodGroup")
      .sort({ date: 1, time: 1 })
      .skip(Number(skip))
      .limit(Number(limit)),
    Appointment.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        appointments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
      "Appointments fetched successfully"
    )
  );
});

const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, _id: userId } = req.user;

  const appointment = await Appointment.findById(id)
    .populate('doctor', 'fullName avatar specialty qualification languagesSpoken consultationHours')
    .populate('patient', 'fullName avatar dob gender bloodGroup allergies emergencyContact')

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Authorization check
  if (role === 'PATIENT' && appointment.patient._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  if (role === 'DOCTOR' && appointment.doctor._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  return res.status(200).json(
    new ApiResponse(200, appointment, "Appointment fetched successfully")
  );
});

const createAppointment = asyncHandler(async (req, res) => {
  const {
    doctor,
    patient,
    date,
    time,
    reason,
    notes,
    duration,
    consultationType
  } = req.body;

  // Validate required fields
  if (!doctor || !patient || !date || !time || !reason) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Check if user is authorized
  if (req.user.role === 'PATIENT' && patient !== req.user._id.toString()) {
    throw new ApiError(403, "You can only book appointments for yourself");
  }

  // Check if doctor exists and is active
  const doctorExists = await User.findOne({ 
    _id: doctor, 
    role: 'DOCTOR',
    isVerified: true 
  });
  
  if (!doctorExists) {
    throw new ApiError(404, "Doctor not found or not verified");
  }

  // Parse date and time
  const appointmentDate = new Date(date);
  const appointmentTime = time;

  // Check if slot is available
  const existingAppointment = await Appointment.findOne({
    doctor,
    date: appointmentDate,
    time: appointmentTime,
    status: { $in: ['Pending', 'Scheduled', 'Confirmed'] }
  });

  if (existingAppointment) {
    throw new ApiError(409, "This time slot is already booked");
  }

  // Check doctor's consultation hours if it's a doctor
  if (req.user.role === 'DOCTOR' && doctorExists.consultationHours) {
    const appointmentTimeNum = parseInt(appointmentTime.replace(':', ''));
    const startTime = parseInt(doctorExists.consultationHours.start.replace(':', ''));
    const endTime = parseInt(doctorExists.consultationHours.end.replace(':', ''));

    if (appointmentTimeNum < startTime || appointmentTimeNum > endTime) {
      throw new ApiError(400, "Appointment time is outside doctor's consultation hours");
    }
  }

  // Create appointment
  const appointment = await Appointment.create({
    doctor,
    patient,
    date: appointmentDate,
    time: appointmentTime,
    reason,
    notes,
    duration: duration || 30,
    consultationType: consultationType || 'In-Person'
  });

  // Populate and return
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('doctor', 'fullName avatar specialty')
    .populate('patient', 'fullName avatar')

  return res.status(201).json(
    new ApiResponse(201, populatedAppointment, "Appointment created successfully")
  );
});

const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Find appointment
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Authorization check
  const isPatient = req.user.role === 'PATIENT' && 
    appointment.patient.toString() === req.user._id.toString();
  const isDoctor = req.user.role === 'DOCTOR' && 
    appointment.doctor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'ADMIN';

  if (!isPatient && !isDoctor && !isAdmin) {
    throw new ApiError(403, "Access denied");
  }

  // Check if updating time slot
  if ((updateData.date || updateData.time) && appointment.status === 'Confirmed') {
    // Verify new time slot availability
    const newDate = updateData.date || appointment.date;
    const newTime = updateData.time || appointment.time;

    const existingAppointment = await Appointment.findOne({
      doctor: appointment.doctor,
      date: newDate,
      time: newTime,
      _id: { $ne: id },
      status: { $in: ['Pending', 'Scheduled', 'Confirmed'] }
    });

    if (existingAppointment) {
      throw new ApiError(409, "New time slot is already booked");
    }
  }

  // Update appointment
  Object.assign(appointment, updateData);
  await appointment.save();

  // Populate and return
  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate('doctor', 'fullName avatar specialty')
    .populate('patient', 'fullName avatar')

  return res.status(200).json(
    new ApiResponse(200, updatedAppointment, "Appointment updated successfully")
  );
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Check if appointment can be cancelled
  if (!['Pending', 'Scheduled', 'Confirmed'].includes(appointment.status)) {
    throw new ApiError(400, "Appointment cannot be cancelled");
  }

  // Authorization check
  const isPatient = req.user.role === 'PATIENT' && 
    appointment.patient.toString() === req.user._id.toString();
  const isDoctor = req.user.role === 'DOCTOR' && 
    appointment.doctor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'ADMIN';

  if (!isPatient && !isDoctor && !isAdmin) {
    throw new ApiError(403, "Access denied");
  }

  // Update appointment
  appointment.status = 'Cancelled';
  appointment.cancellationReason = cancellationReason;
  await appointment.save();

  return res.status(200).json(
    new ApiResponse(200, appointment, "Appointment cancelled successfully")
  );
});

const getAvailableSlots = asyncHandler(async (req, res) => {
  const { doctorId, date, consultationType = 'In-Person' } = req.query;

  if (!doctorId || !date) {
    throw new ApiError(400, "Doctor ID and date are required");
  }

  // Get doctor details
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'DOCTOR') {
    throw new ApiError(404, "Doctor not found");
  }

  // Get doctor's consultation hours
  const consultationHours = doctor.consultationHours || { 
    start: '09:00', 
    end: '17:00' 
  };

  // Get existing appointments for the day
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const bookedAppointments = await Appointment.find({
    doctor: doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['Pending', 'Scheduled', 'Confirmed'] }
  });

  // Generate time slots (30-minute intervals)
  const availableSlots = [];
  const startTime = new Date(`${date}T${consultationHours.start}`);
  const endTime = new Date(`${date}T${consultationHours.end}`);
  
  let currentTime = new Date(startTime);
  
  while (currentTime < endTime) {
    const timeString = currentTime.toTimeString().slice(0, 5);
    const isBooked = bookedAppointments.some(apt => apt.time === timeString);
    
    if (!isBooked) {
      availableSlots.push({
        time: timeString,
        available: true,
        consultationType: consultationType
      });
    }
    
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return res.status(200).json(
    new ApiResponse(200, {
      doctor: {
        id: doctor._id,
        name: doctor.fullName,
        specialty: doctor.specialty
      },
      date,
      consultationHours,
      availableSlots,
      totalSlots: availableSlots.length
    }, "Available slots fetched successfully")
  );
});

export {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots
};