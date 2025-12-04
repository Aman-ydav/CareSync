import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  }
}, { _id: true });

const vitalSignsSchema = new mongoose.Schema({
  bloodPressure: {
    type: String,
    trim: true
  },
  heartRate: {
    type: Number,
    min: 0
  },
  temperature: {
    type: Number,
    min: 0
  },
  oxygenSaturation: {
    type: Number,
    min: 0,
    max: 100
  },
  weight: {
    type: Number,
    min: 0
  },
  height: {
    type: Number,
    min: 0
  },
  bmi: {
    type: Number,
    min: 0
  }
});

const healthRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  prescriptions: [prescriptionSchema],
  notes: {
    type: String,
    trim: true
  },
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  fileUrls: [{
    url: String,
    fileName: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  vitalSigns: vitalSignsSchema,
  followUpDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Deleted'],
    default: 'Active'
  }
}, {
  timestamps: true
});

healthRecordSchema.index({ patient: 1, visitDate: -1 });
healthRecordSchema.index({ doctor: 1, visitDate: -1 });
healthRecordSchema.index({ hospital: 1 });
healthRecordSchema.index({ status: 1 });

export const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);