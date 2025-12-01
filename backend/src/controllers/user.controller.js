import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { cleanupLocalFiles } from "../utils/fileCleanUp.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import "../config.js";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found while generating tokens");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    userName,
    fullName,
    email,
    password,
    confirmPassword,
    role,
    phone,
    dob,
    gender,
    address,
    hospitalId,
    hospitalName,
    specialty,
    experienceYears,
    qualification,
    languagesSpoken,
    about,
    consultationHours,
    medicalHistory,
    bloodGroup,
    allergies,
    emergencyContact,
  } = req.body;

  if (
    !userName ||
    !fullName ||
    !email ||
    !password ||
    !confirmPassword ||
    !role
  ) {
    cleanupLocalFiles(req.files);
    throw new ApiError(400, "Required fields missing");
  }

  if (!/\S+@\S+\.\S+/.test(email))
    throw new ApiError(400, "Invalid email format");
  if (password !== confirmPassword)
    throw new ApiError(400, "Passwords do not match");

  const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (existingUser) throw new ApiError(409, "User already exists");

  let avatarUrl = "";
  if (req.file?.path) avatarUrl = req.file.path;
  const avatar = avatarUrl ? await uploadOnCloudinary(avatarUrl) : null;

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const newUser = await User.create({
    userName,
    fullName,
    email,
    password,
    confirmPassword,
    role,
    phone,
    dob,
    gender,
    address,
    avatar: avatar?.url,
    hospitalId,
    hospitalName,
    specialty,
    experienceYears,
    qualification,
    languagesSpoken,
    about,
    consultationHours,
    medicalHistory,
    bloodGroup,
    allergies,
    emergencyContact,
    isVerified: false,
    verificationCode,
    verificationCodeExpire: Date.now() + 10 * 60 * 1000,
  });


  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    newUser._id
  );

  // Remove sensitive fields before sending to frontend
  const safeUser = await User.findById(newUser._id).select(
    "-password -confirmPassword -refreshToken -verificationCode"
  );

  // Set refresh token cookie
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: safeUser,
        accessToken,
      },
      "Registration successful. Verification code sent to your email."
    )
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) throw new ApiError(400, "Email and code required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) {
    return res.status(200).json(new ApiResponse(200, {}, "Already verified"));
  }

  if (user.verificationCode !== code) {
    throw new ApiError(400, "Invalid verification code");
  }

  if (user.verificationCodeExpire < Date.now()) {
    throw new ApiError(400, "Verification code expired");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email already verified"));
  }

  // Generate new verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.verificationCode = verificationCode;
  user.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // Send verification email
  const html = `
    <div style="font-family:sans-serif;padding:20px;">
      <h3>CareSync Email Verification</h3>
      <p>Your new 6-digit verification code:</p>
      <h2>${verificationCode}</h2>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;

  await sendEmail(email, "Verify your CareSync account", html);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Verification code resent successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User not found");

  const isValid = await user.checkPassword(password);
  if (!isValid) throw new ApiError(401, "Invalid password");

  // Check if email is verified
  if (!user.isVerified) {
    // Generate tokens but mark as unverified
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const safeUser = await User.findById(user._id).select(
      "-password -confirmPassword -refreshToken -verificationCode"
    );

    // Set cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return with verification required flag
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: safeUser,
          accessToken,
          refreshToken,
          requiresVerification: true,  
        },
        "Login successful. Please verify your email."
      )
    );
  }

  // If verified, proceed normally
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const safeUser = await User.findById(user._id).select(
    "-password -confirmPassword -refreshToken -verificationCode"
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: safeUser,
        accessToken,
        refreshToken,
      },
      "Login successful"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });

  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Check cookies first, then body - JUST LIKE ROOMEZY
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  console.log("Refresh token check - Cookies:", req.cookies);
  console.log("Refresh token check - Body:", req.body);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded?._id);
    if (!user) throw new ApiError(401, "User not found");

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is expired or mismatched");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    // Update cookie with new refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken, // Also return new refresh token
        },
        "Access token refreshed successfully"
      )
    );
  } catch (error) {
    console.error("Token refresh error:", error.message);
    throw new ApiError(401, `Invalid refresh token: ${error.message}`);
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new ApiError(
      400,
      "Old password, new password and confirmation are required"
    );
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "New password and confirmation do not match");
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const isValid = await user.checkPassword(oldPassword);
  if (!isValid) throw new ApiError(401, "Old password is incorrect");

  user.password = newPassword;
  user.confirmPassword = newPassword;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "Current user fetched"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL_PROD}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family:sans-serif;background:#f7f9fc;padding:20px;border-radius:10px;">
      <h2 style="color:#007bff;">Reset Your CareSync Password</h2>
      <p>We received a request to reset your password.</p>
      <a href="${resetUrl}" style="background:#007bff;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="color:#555;">- The CareSync Team</p>
    </div>
  `;

  await sendEmail(user.email, "Password Reset Request", html);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Reset link sent successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Invalid or expired token");

  user.password = req.body.password;
  user.confirmPassword = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful"));
});

const getUserProfileById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -confirmPassword -refreshToken -verificationCode"
  );

  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const updatableFields = [
    "fullName",
    "phone",
    "dob",
    "gender",
    "address",
    "specialty",
    "experienceYears",
    "qualification",
    "languagesSpoken",
    "about",
    "consultationHours",
    "medicalHistory",
    "bloodGroup",
    "allergies",
    "emergencyContact",
  ];

  const updateData = {};

  updatableFields.forEach((key) => {
    if (req.body[key] !== undefined) updateData[key] = req.body[key];
  });

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true }
  ).select("-password -confirmPassword -refreshToken");

  if (!updatedUser) throw new ApiError(404, "User not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Account details updated successfully")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(500, "Avatar upload failed");

  const user = await User.findById(req.user._id);

  const oldAvatar = user.avatar;
  user.avatar = avatar.url;
  await user.save();

  if (oldAvatar) {
    await deleteFromCloudinary(oldAvatar).catch(() => {});
  }

  const updatedUser = await User.findById(req.user._id).select(
    "-password -confirmPassword -refreshToken"
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError(404, "User not found");

  if (user.avatar) {
    await deleteFromCloudinary(user.avatar).catch(() => {});
  }

  await User.findByIdAndDelete(req.user._id);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

export {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  forgotPassword,
  resetPassword,
  getUserProfileById,
  updateAccountDetails,
  updateUserAvatar,
  deleteAccount,
  resendVerificationCode,
};
