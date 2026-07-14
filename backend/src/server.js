import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";
import { validateEnv, env } from "./utils/env.js";
import { logger } from "./utils/logger.js";

dotenv.config({ path: "./.env" });

validateEnv();

const PORT = env.port;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${env.nodeEnv} mode on port ${PORT}`);
    });
    
    process.on("SIGINT", async () => {
      logger.info("Received SIGINT, shutting down gracefully...");
      server.close(() => {
        logger.info("HTTP server closed");
      });
      await mongoose.disconnect();
      logger.info("MongoDB connection closed");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      logger.info("Received SIGTERM, shutting down gracefully...");
      server.close(() => {
        logger.info("HTTP server closed");
      });
      await mongoose.disconnect();
      logger.info("MongoDB connection closed");
      process.exit(0);
    });

    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Promise Rejection:", err);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((error) => {
    logger.error("Failed to start server:", error);
    process.exit(1);
  });
