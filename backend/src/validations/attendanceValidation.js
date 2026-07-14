import { body, param, query } from "express-validator";

const validateAttendance = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Please enter a valid date"),

  body("workers")
    .isArray({ min: 1 })
    .withMessage("At least one worker is required"),

  body("workers.*.workerId")
    .notEmpty()
    .withMessage("Worker ID is required"),

  body("workers.*.status")
    .isIn(["present", "absent"])
    .withMessage("Status must be either present or absent"),

  body("submittedBy")
    .notEmpty()
    .withMessage("Submitted by is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Submitted by must be between 2 and 50 characters"),

  body("note")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters"),
];

const validateAttendanceId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid attendance ID"),
];

const validateAttendanceQuery = [
  query("siteId")
    .optional()
    .isMongoId()
    .withMessage("Invalid site ID"),

  query("date")
    .optional()
    .isISO8601()
    .withMessage("Please enter a valid date"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("search")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),

  query("sort")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Sort field cannot exceed 50 characters"),
];

export { validateAttendance, validateAttendanceId, validateAttendanceQuery };
