import { body } from "express-validator";

const validateSiteLogin = [
  body("name")
    .notEmpty()
    .withMessage("Site name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Site name must be between 2 and 100 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 50 })
    .withMessage("Password must be at least 4 characters"),
];

export { validateSiteLogin };
