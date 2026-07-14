import mongoose from "mongoose";

const MaterialRequestSchema = new mongoose.Schema(
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
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    materials: [
      {
        materialId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Material",
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        unit: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],
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

const MaterialRequest =
  mongoose.models.MaterialRequest ||
  mongoose.model("MaterialRequest", MaterialRequestSchema);

MaterialRequestSchema.index({ siteId: 1, status: 1 });
MaterialRequestSchema.index({ date: -1 });
MaterialRequestSchema.index({ status: 1 });

export default MaterialRequest;
