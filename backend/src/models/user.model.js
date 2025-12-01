import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    // Common fields
    userName: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },

    fullName: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "DOCTOR", "PATIENT"],
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    confirmPassword: {
      type: String,
      required: true,
    },

    avatar: {
      type: String, // Cloudinary URL
    },

    phone: {
      type: String,
      trim: true,
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    hospitalName: {
      type: String,
    },

    // Doctor-specific fields
    specialty: {
      type: String,
    },

    experienceYears: {
      type: Number,
    },

    qualification: {
      type: String,
    },

    languagesSpoken: [
      {
        type: String,
      },
    ],

    about: {
      type: String,
    },

    consultationHours: {
      start: String,
      end: String,
    },

    // Patient-specific fields
    medicalHistory: {
      type: String,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    allergies: [
      {
        type: String,
      },
    ],

    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },

    // Tokens
    refreshToken: {
      type: String,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
    },

    verificationCodeExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = this.password;
});

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min expiry

  return resetToken;
};

export const User = mongoose.model("User", userSchema);
