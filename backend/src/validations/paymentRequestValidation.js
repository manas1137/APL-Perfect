import { body, param, query } from "express-validator";

const validatePaymentRequest = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Please enter a valid date"),

  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Purpose must be between 2 and 200 characters"),

  body("requestedBy")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Requested by must be between 2 and 50 characters"),

  body("siteLocation")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Site location cannot exceed 200 characters"),

  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  body("note")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters"),
];

const validatePaymentReview = [
  param("id")
    .isMongoId()
    .withMessage("Invalid payment request ID"),

  body("adminRemark")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Admin remark cannot exceed 500 characters")
    .trim(),
];

const validatePaymentId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid payment request ID"),
];

const validatePaymentQuery = [
  query("siteId")
    .optional()
    .isMongoId()
    .withMessage("Invalid site ID"),

  query("status")
    .optional()
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Invalid status"),

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

export {
  validatePaymentRequest,
  validatePaymentReview,
  validatePaymentId,
  validatePaymentQuery,
};
