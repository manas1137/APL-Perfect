import express from "express";
import { validationResult } from "express-validator";
import { loginSite, logoutSite } from "../controllers/siteAuthController.js";
import { validateSiteLogin } from "../validations/siteAuthValidation.js";

const router = express.Router();

// Returns every validation error instead of failing silently
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("[SITE AUTH ROUTE] Validation failed:", JSON.stringify(errors.array()));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

router.post("/login", validateSiteLogin, checkValidation, loginSite);
router.post("/logout", logoutSite);

export default router;
