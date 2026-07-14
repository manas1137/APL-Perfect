import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  addMaterial,
  getMaterials,
  getMaterial,
  updateMaterialById,
  removeMaterial,
} from "../controllers/materialController.js";
import {
  validateMaterialCreate,
  validateMaterialUpdate,
  validateMaterialId,
} from "../validations/materialValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.post("/add", validateMaterialCreate, asyncHandler(addMaterial));

router.get("/", asyncHandler(getMaterials));

router.get("/:id", validateMaterialId, asyncHandler(getMaterial));

router.put("/:id", validateMaterialUpdate, asyncHandler(updateMaterialById));

router.delete("/:id", validateMaterialId, asyncHandler(removeMaterial));

export default router;
