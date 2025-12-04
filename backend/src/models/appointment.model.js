import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  hospitalName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    default: 30,
    min: 15,
    max: 120
  },
  consultationType: {
    type: String,
    enum: ['In-Person', 'Teleconsultation'],
    default: 'In-Person'
  },
  meetingLink: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for preventing double booking
appointmentSchema.index({ 
  doctor: 1, 
  date: 1, 
  time: 1 
}, { 
  unique: true,
  partialFilterExpression: { 
    status: { 
      $in: ['Pending', 'Scheduled', 'Confirmed'] 
    } 
  } 
});

appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ 'hospital': 1, 'date': 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);