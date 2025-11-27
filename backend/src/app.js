import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./config.js";
import { ApiError } from "./utils/apiError.js";


const app = express();


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);  

      if (allowedOrigins.includes(origin)) {
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


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


app.use(express.static("public"));

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Caresync backend is live!",
    timestamp: new Date().toISOString(),
  });
});



app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});




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
