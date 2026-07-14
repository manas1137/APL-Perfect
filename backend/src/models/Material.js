import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Material name must be at least 2 characters"],
      maxlength: [100, "Material name cannot exceed 100 characters"],
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, "Unit price cannot be negative"],
    },
    unit: {
      type: String,
      required: true,
      enum: [
        "kg",
        "liter",
        "piece",
        "bag",
        "meter",
        "sqft",
        "cubic_feet",
        "ton",
        "dozen",
        "other",
      ],
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

MaterialSchema.index({ name: "text" });
MaterialSchema.index({ isActive: 1 });

const Material =
  mongoose.models.Material || mongoose.model("Material", MaterialSchema);

export default Material;
