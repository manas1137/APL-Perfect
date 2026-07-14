import express from "express";
import { siteProtect } from "../middleware/siteProtect.js";
import {
  getDashboard,
  getDetails,
  getAssignedWorkersList,
  getMaterialsList,
} from "../controllers/siteController.js";

const router = express.Router();

router.use(siteProtect);

router.get("/dashboard", getDashboard);
router.get("/details", getDetails);
router.get("/assigned-workers", getAssignedWorkersList);
router.get("/materials", getMaterialsList);

export default router;
