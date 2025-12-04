import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  reason: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Scheduled",
      "Confirmed",
      "Completed",
      "Cancelled"
    ],
    default: "Pending"
  },

  notes: String,
  cancellationReason: String,
  reminderSent: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});


appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["Pending", "Scheduled", "Confirmed"] }
    }
  }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
