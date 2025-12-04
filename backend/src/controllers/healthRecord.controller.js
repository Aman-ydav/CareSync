import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HealthRecord } from "../models/HealthRecord.model.js";
import { User } from "../models/user.model.js"; 

const getHealthRecords = asyncHandler(async (req, res) => {
  const { patientId, doctorId, startDate, endDate, status } = req.query;
  const { role, _id: userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let filter = { status: 'Active' };

  // Role-based filtering
  if (role === 'PATIENT') {
    filter.patient = userId;
  } else if (role === 'DOCTOR') {
    filter.doctor = userId;
  }

  // Additional filters
  if (patientId) filter.patient = patientId;
  if (doctorId) filter.doctor = doctorId;
  if (status) filter.status = status;

  // Date range filtering
  if (startDate || endDate) {
    filter.visitDate = {};
    if (startDate) filter.visitDate.$gte = new Date(startDate);
    if (endDate) filter.visitDate.$lte = new Date(endDate);
  }

  const [records, total] = await Promise.all([
    HealthRecord.find(filter)
      .populate('patient', 'fullName avatar dob gender bloodGroup')
      .populate('doctor', 'fullName avatar specialty qualification')
      .sort({ visitDate: -1 })
      .skip(skip)
      .limit(limit),
    HealthRecord.countDocuments(filter)
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }, "Health records fetched successfully")
  );
});

const getHealthRecordById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, _id: userId } = req.user;

  const record = await HealthRecord.findById(id)
    .populate('patient', 'fullName avatar dob gender bloodGroup allergies emergencyContact')
    .populate('doctor', 'fullName avatar specialty qualification languagesSpoken')

  if (!record) {
    throw new ApiError(404, "Health record not found");
  }

  // Authorization check
  if (role === 'PATIENT' && record.patient._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  if (role === 'DOCTOR' && record.doctor._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied");
  }

  return res.status(200).json(
    new ApiResponse(200, record, "Health record fetched successfully")
  );
});

const createHealthRecord = asyncHandler(async (req, res) => {
  const {
    patient,
    doctor,
    diagnosis,
    prescriptions,
    notes,
    visitDate,
    vitalSigns,
    followUpDate
  } = req.body;

  // Validate required fields
  if (!patient || !doctor || !diagnosis) {
    throw new ApiError(400, "Patient, doctor, and diagnosis are required");
  }

  // Only doctors and admins can create health records
  if (!['DOCTOR', 'ADMIN'].includes(req.user.role)) {
    throw new ApiError(403, "Only doctors and admins can create health records");
  }

  // Verify patient exists
  const patientExists = await User.findById(patient);
  if (!patientExists || patientExists.role !== 'PATIENT') {
    throw new ApiError(400, "Invalid patient");
  }

  // Create health record
  const healthRecord = await HealthRecord.create({
    patient,
    doctor: req.user.role === 'DOCTOR' ? req.user._id : doctor,
    diagnosis,
    prescriptions: prescriptions || [],
    notes,
    visitDate: visitDate ? new Date(visitDate) : Date.now(),
    vitalSigns,
    followUpDate
  });

  // Populate and return
  const populatedRecord = await HealthRecord.findById(healthRecord._id)
    .populate('patient', 'fullName avatar')
    .populate('doctor', 'fullName avatar specialty')

  return res.status(201).json(
    new ApiResponse(201, populatedRecord, "Health record created successfully")
  );
});

const updateHealthRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Find record
  const record = await HealthRecord.findById(id);
  if (!record) {
    throw new ApiError(404, "Health record not found");
  }

  // Authorization check
  if (!['DOCTOR', 'ADMIN'].includes(req.user.role)) {
    throw new ApiError(403, "Only doctors and admins can update health records");
  }

  if (req.user.role === 'DOCTOR' && record.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own records");
  }

  // Update record
  Object.assign(record, updateData);
  await record.save();

  // Populate and return
  const updatedRecord = await HealthRecord.findById(record._id)
    .populate('patient', 'fullName avatar')
    .populate('doctor', 'fullName avatar specialty')

  return res.status(200).json(
    new ApiResponse(200, updatedRecord, "Health record updated successfully")
  );
});

const deleteHealthRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await HealthRecord.findById(id);
  if (!record) {
    throw new ApiError(404, "Health record not found");
  }

  // Only doctors and admins can delete
  if (!['DOCTOR', 'ADMIN'].includes(req.user.role)) {
    throw new ApiError(403, "Access denied");
  }

  // Soft delete
  record.status = 'Deleted';
  await record.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Health record deleted successfully")
  );
});

export {
  getHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord
};