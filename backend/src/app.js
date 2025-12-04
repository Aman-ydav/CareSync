import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./config.js";
import { ApiError } from "./utils/apiError.js";

// Import all routes
import userRoutes from "./routes/user.routes.js";
// import hospitalRoutes from "./routes/hospital.routes.js";
import healthRecordRoutes from "./routes/healthRecord.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import aiChatRoutes from "./routes/aiChat.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        console.log(`[CORS] Allowed: ${origin}`);
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["set-cookie"],
  })
);

// Body parsers
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files
app.use(express.static("public"));

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Caresync backend is live!",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API routes
app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/health-records", healthRecordRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/ai-chat", aiChatRoutes);
app.use("/api/v1/admin", adminRoutes);


// 404 handler for API routes
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});
export { app };