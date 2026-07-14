import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  addWorker,
  getWorkers,
  getWorker,
  updateWorkerById,
  removeWorker,
} from "../controllers/workerController.js";
import {
  validateWorkerCreate,
  validateWorkerUpdate,
  validateWorkerId,
} from "../validations/workerValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.post(
  "/add",
  validateWorkerCreate,
  asyncHandler(addWorker)
);

router.get(
  "/",
  asyncHandler(getWorkers)
);

router.get(
  "/:id",
  validateWorkerId,
  asyncHandler(getWorker)
);

router.put(
  "/:id",
  validateWorkerUpdate,
  asyncHandler(updateWorkerById)
);

router.delete(
  "/:id",
  validateWorkerId,
  asyncHandler(removeWorker)
);

export default router;
