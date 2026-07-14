import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoose from "mongoose";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/error.js";
import { securityMiddleware } from "./middleware/security.js";
import { logRequest, logError } from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";
import siteAuthRoutes from "./routes/siteAuthRoutes.js";
import siteRoutes from "./routes/siteRoutes.js";
import siteAdminRoutes from "./routes/siteAdminRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import paymentRequestRoutes from "./routes/paymentRequestRoutes.js";
import materialRequestRoutes from "./routes/materialRequestRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

// CORS must be registered BEFORE the rate limiters in securityMiddleware,
// otherwise a rate-limited response (e.g. 429 on an OPTIONS preflight) is
// returned without Access-Control-Allow-Origin and the browser blocks it.
app.use(
  cors({
    origin: (origin, callback) => {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
      const isDevelopment = process.env.NODE_ENV === "development";

      if (!origin) {
        callback(null, true);
        return;
      }

      if (origin === clientUrl) {
        callback(null, true);
        return;
      }

      if (isDevelopment && origin.startsWith("http://localhost:")) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

securityMiddleware(app);

app.use(compression());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(logRequest);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "APL Perfect Backend is running",
    status: "success",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.status(200).json({
    status: "success",
    message: "Health check passed",
    data: {
      server: "running",
      database: dbStatus,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/site/auth", siteAuthRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/sites", siteAdminRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payment", paymentRequestRoutes);
app.use("/api/material-request", materialRequestRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(logError);
app.use(errorHandler);

export default app;
