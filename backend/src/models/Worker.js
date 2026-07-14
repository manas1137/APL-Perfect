import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Worker name must be at least 2 characters"],
      maxlength: [50, "Worker name cannot exceed 50 characters"],
    },
    esiNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pfNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit mobile number",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

WorkerSchema.index({ mobileNumber: 1 });
WorkerSchema.index({ isActive: 1 });
WorkerSchema.index({ name: "text" });

const Worker =
  mongoose.models.Worker || mongoose.model("Worker", WorkerSchema);

export default Worker;
