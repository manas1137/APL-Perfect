import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalWorkers: {
      type: Number,
      required: true,
      min: [0, "Total workers cannot be negative"],
    },
    workers: [
      {
        workerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Worker",
          required: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        status: {
          type: String,
          enum: ["present", "absent"],
          default: "absent",
        },
      },
    ],
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    submittedBy: {
      type: String,
      required: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: String,
      trim: true,
    },
    reviewedAt: {
      type: Date,
    },
    adminRemark: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

AttendanceSchema.index({ siteId: 1, date: 1 }, { unique: true });

const Attendance =
  mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
