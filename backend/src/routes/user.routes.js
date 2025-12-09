import { Router } from "express";
import {
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
  getAllUsers,
  getDoctorProfile,
  getPatientProfile,
  getPatients,
  getDoctors
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";



const router = Router();

// Authentication routes
router.route("/register").post(
  upload.single("avatar"),
  registerUser
);

router.route("/verify-email").post(verifyEmail);

router.route("/resend-verification").post(resendVerificationCode);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

// Password management
router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:token").post(resetPassword);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// User profile routes
router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/profile/:id").get(verifyJWT, getUserProfileById);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/update-avatar").patch(
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);

router.route("/delete-account").delete(verifyJWT, deleteAccount);

router.get(
  "/doctors",
  verifyJWT,
  verifyRole(["PATIENT", "DOCTOR", "ADMIN"]),
  getDoctors
);

router.get(
  "/doctor/:id",
  verifyJWT,
  verifyRole(["PATIENT", "DOCTOR", "ADMIN"]),
  getDoctorProfile
);

router.get(
  "/patients",
  verifyJWT,
  verifyRole(["DOCTOR", "ADMIN"]),
  getPatients
);

router.get(
  "/patient/:id",
  verifyJWT,
  verifyRole(["DOCTOR", "ADMIN"]),
  getPatientProfile
);

router.get(
  "/all",
  verifyJWT,
  verifyRole(["ADMIN"]),
  getAllUsers
);


export default router;