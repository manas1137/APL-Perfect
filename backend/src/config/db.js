import mongoose from "mongoose";
import { env } from "../utils/env.js";
import { logger } from "../utils/logger.js";
import Admin from "../models/Admin.js";
import Site from "../models/Site.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri, {
      maxPoolSize: parseInt(process.env.MONGODB_POOL_SIZE) || 10,
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE) || 2,
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) || 5000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    const adminExists = await Admin.findOne({ username: "admin" }).lean();
    if (!adminExists) {
      await Admin.create({
        name: "System Administrator",
        username: "admin",
        email: "admin@apl.com",
        password: "Admin@123",
      });
      logger.info("Default admin account created successfully.");
    } else {
      logger.info("Default admin already exists.");
    }

    const sitesCollection = mongoose.connection.db.collection("sites");
    const indexes = await sitesCollection.indexes();
    const staleIndex = indexes.find((idx) => idx.name === "siteId_1_date_1");
    if (staleIndex) {
      await sitesCollection.dropIndex("siteId_1_date_1");
      logger.info("Dropped stale unique index siteId_1_date_1 from sites collection.");
    }

    const missingOriginalBudget = await sitesCollection.countDocuments({
      originalBudget: { $exists: false },
    });
    if (missingOriginalBudget > 0) {
      const result = await sitesCollection.updateMany(
        { originalBudget: { $exists: false } },
        [{ $set: { originalBudget: "$budget" } }]
      );
      logger.info(`Backfilled originalBudget for ${result.modifiedCount} site(s).`);
    }
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
