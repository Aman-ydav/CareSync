import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  medicine: String,
  dosage: String,
  frequency: String,
  duration: String,
  instructions: String
});

const healthRecordSchema = new mongoose.Schema({

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  diagnosis: {
    type: String,
    required: true
  },

  prescriptions: [prescriptionSchema],

  notes: String,

  visitDate: {
    type: Date,
    default: Date.now
  },

  followUpDate: Date,

  status: {
    type: String,
    enum: ["Active", "Archived"],
    default: "Active"
  }

}, {
  timestamps: true
});

healthRecordSchema.index({ patient: 1, visitDate: -1 });
healthRecordSchema.index({ doctor: 1, visitDate: -1 });

export const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
