import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [2, "Site name must be at least 2 characters"],
      maxlength: [100, "Site name cannot exceed 100 characters"],
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Owner name must be at least 2 characters"],
      maxlength: [50, "Owner name cannot exceed 50 characters"],
    },
    ownerMobile: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit mobile number",
      ],
    },
    ownerEmail: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    budget: {
      type: Number,
      required: true,
      min: [0, "Budget cannot be negative"],
    },
    originalBudget: {
      type: Number,
      required: false,
      min: [0, "Original budget cannot be negative"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Location must be at least 5 characters"],
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    password: {
      type: String,
      required: true,
      minlength: [4, "Site password must be at least 4 characters"],
      select: false,
    },
    assignedWorkers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    stats: {
      totalWorkers: {
        type: Number,
        default: 0,
      },
      totalPresentToday: {
        type: Number,
        default: 0,
      },
      totalAbsentToday: {
        type: Number,
        default: 0,
      },
      pendingRequests: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

SiteSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

SiteSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Site =
  mongoose.models.Site || mongoose.model("Site", SiteSchema);

SiteSchema.index({ isActive: 1 });
SiteSchema.index({ ownerName: "text" });
SiteSchema.index({ location: "text" });

export default Site;
