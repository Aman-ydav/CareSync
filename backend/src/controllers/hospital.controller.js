import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Hospital } from "../models/Hospital.model.js";

const getHospitals = asyncHandler(async (req, res) => {
  const { city, state, country, search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let filter = { isActive: true };

  if (city) filter.city = { $regex: city, $options: 'i' };
  if (state) filter.state = { $regex: state, $options: 'i' };
  if (country) filter.country = { $regex: country, $options: 'i' };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { state: { $regex: search, $options: 'i' } }
    ];
  }

  const [hospitals, total] = await Promise.all([
    Hospital.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    Hospital.countDocuments(filter)
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      hospitals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }, "Hospitals fetched successfully")
  );
});

const getHospitalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  if (req.user?.role !== 'ADMIN') {
    throw new ApiError(403, "Hospital is not active");
  }

  return res.status(200).json(
    new ApiResponse(200, hospital, "Hospital fetched successfully")
  );
});

const createHospital = asyncHandler(async (req, res) => {
  const {
    name,
    city,
    state,
    country,
    contactEmail,
    address,
    phone,
    description
  } = req.body;

  // Validate required fields
  if (!name || !city || !state || !country || !contactEmail) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Check if hospital already exists
  const existingHospital = await Hospital.findOne({ 
    $or: [{ name }, { contactEmail }] 
  });
  
  if (existingHospital) {
    throw new ApiError(409, "Hospital with this name or email already exists");
  }

  // Create hospital
  const hospital = await Hospital.create({
    name,
    city,
    state,
    country,
    contactEmail,
    address,
    phone,
    description
  });

  return res.status(201).json(
    new ApiResponse(201, hospital, "Hospital created successfully")
  );
});

const updateHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if hospital exists
  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  // If updating name, check for conflicts
  if (updateData.name && updateData.name !== hospital.name) {
    const existingHospital = await Hospital.findOne({ 
      name: updateData.name,
      _id: { $ne: id }
    });
    
    if (existingHospital) {
      throw new ApiError(409, "Hospital name already exists");
    }
  }

  // Update hospital
  Object.assign(hospital, updateData);
  await hospital.save();

  return res.status(200).json(
    new ApiResponse(200, hospital, "Hospital updated successfully")
  );
});

const deleteHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  // Soft delete by setting isActive to false
  hospital.isActive = false;
  await hospital.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Hospital deactivated successfully")
  );
});

export {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
};