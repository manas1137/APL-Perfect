import express from "express";
import { loginAdmin, logoutAdmin } from "../controllers/authController.js";
import {
  validateLogin,
} from "../validations/authValidation.js";

const router = express.Router();

router.post("/login", validateLogin, loginAdmin);
router.post("/logout", logoutAdmin);

export default router;
