import { body, param, query } from "express-validator";

const validateSiteCreate = [
  body("name")
    .notEmpty()
    .withMessage("Site name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Site name must be between 2 and 100 characters")
    .trim(),

  body("ownerName")
    .notEmpty()
    .withMessage("Owner name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Owner name must be between 2 and 50 characters")
    .trim(),

  body("ownerMobile")
    .notEmpty()
    .withMessage("Owner mobile is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit mobile number")
    .trim(),

  body("ownerEmail")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .trim(),

  body("budget")
    .notEmpty()
    .withMessage("Budget is required")
    .isFloat({ min: 0 })
    .withMessage("Budget must be a positive number"),

  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Location must be between 5 and 200 characters")
    .trim(),

  body("password")
    .notEmpty()
    .withMessage("Site password is required")
    .isLength({ min: 4, max: 50 })
    .withMessage("Site password must be between 4 and 50 characters"),

  body("assignedWorkers")
    .optional()
    .isArray()
    .withMessage("Assigned workers must be an array"),

  body("assignedWorkers.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid worker ID"),
];

const validateSiteUpdate = [
  param("id")
    .isMongoId()
    .withMessage("Invalid site ID"),

  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Site name must be between 2 and 100 characters")
    .trim(),

  body("ownerName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Owner name must be between 2 and 50 characters")
    .trim(),

  body("ownerMobile")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit mobile number")
    .trim(),

  body("ownerEmail")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .trim(),

  body("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be a positive number"),

  body("location")
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage("Location must be between 5 and 200 characters")
    .trim(),

  body("assignedWorkers")
    .optional()
    .isArray()
    .withMessage("Assigned workers must be an array"),

  body("assignedWorkers.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid worker ID"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const validateSiteId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid site ID"),
];

export {
  validateSiteCreate,
  validateSiteUpdate,
  validateSiteId,
};
