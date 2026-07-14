import mongoose from "mongoose";

const PaymentRequestSchema = new mongoose.Schema(
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
    purpose: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Purpose cannot exceed 200 characters"],
    },
    requestedBy: {
      type: String,
      required: true,
      trim: true,
    },
    siteLocation: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
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

const PaymentRequest =
  mongoose.models.PaymentRequest ||
  mongoose.model("PaymentRequest", PaymentRequestSchema);

PaymentRequestSchema.index({ siteId: 1, status: 1 });
PaymentRequestSchema.index({ date: -1 });
PaymentRequestSchema.index({ status: 1 });

export default PaymentRequest;
