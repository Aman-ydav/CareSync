import HealthRecord from "../models/HealthRecord.js";

export const getHealthRecords = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let filter = {};

    if (role === "PATIENT") {
      filter.patient = _id;
    } else if (role === "DOCTOR") {
      filter.doctor = _id;
    }

    const records = await HealthRecord.find(filter)
      .populate("patient", "name avatar dob gender")
      .populate("doctor", "name avatar specialty")
      .sort({ visitDate: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getHealthRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id)
      .populate(
        "patient",
        "name avatar dob gender bloodGroup allergies emergencyContact"
      )
      .populate("doctor", "name avatar specialty qualification");

    if (!record) {
      return res.status(404).json({ message: "Health record not found" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createHealthRecord = async (req, res) => {
  try {
    const record = new HealthRecord(req.body);
    await record.save();

    const populatedRecord = await HealthRecord.findById(record._id)
      .populate("patient", "name avatar")
      .populate("doctor", "name avatar specialty");

    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("patient", "name avatar")
      .populate("doctor", "name avatar specialty");

    if (!record) {
      return res.status(404).json({ message: "Health record not found" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
