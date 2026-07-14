import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    paymentRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentRequest",
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Purpose cannot exceed 200 characters"],
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    createdBy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

ExpenseSchema.index({ siteId: 1, paymentRequestId: 1 });
ExpenseSchema.index({ createdAt: -1 });
ExpenseSchema.index({ paymentRequestId: 1 });

export default Expense;
