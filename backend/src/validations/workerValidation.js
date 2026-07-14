import { body, param } from "express-validator";

const validateWorkerCreate = [
  body("name")
    .notEmpty()
    .withMessage("Worker name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Worker name must be between 2 and 50 characters")
    .trim(),

  body("esiNumber")
    .notEmpty()
    .withMessage("ESI number is required")
    .trim(),

  body("pfNumber")
    .notEmpty()
    .withMessage("PF number is required")
    .trim(),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit mobile number")
    .trim(),
];

const validateWorkerUpdate = [
  param("id")
    .isMongoId()
    .withMessage("Invalid worker ID"),

  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Worker name must be between 2 and 50 characters")
    .trim(),

  body("esiNumber")
    .optional()
    .trim(),

  body("pfNumber")
    .optional()
    .trim(),

  body("mobileNumber")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit mobile number")
    .trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const validateWorkerId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid worker ID"),
];

export { validateWorkerCreate, validateWorkerUpdate, validateWorkerId };
