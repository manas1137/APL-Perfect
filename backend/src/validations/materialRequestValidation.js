import { body, param, query } from "express-validator";

const validateMaterialRequest = [
  body("materials")
    .isArray({ min: 1 })
    .withMessage("At least one material is required"),

  body("materials.*.name")
    .notEmpty()
    .withMessage("Material name is required")
    .isLength({ max: 100 })
    .withMessage("Material name cannot exceed 100 characters"),

  body("materials.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("materials.*.unit")
    .notEmpty()
    .withMessage("Unit is required")
    .isLength({ max: 20 })
    .withMessage("Unit cannot exceed 20 characters"),

  body("materials.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("note")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters"),
];

const validateMaterialReview = [
  param("id")
    .isMongoId()
    .withMessage("Invalid material request ID"),

  body("adminRemark")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Admin remark cannot exceed 500 characters")
    .trim(),
];

const validateMaterialId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid material request ID"),
];

const validateMaterialQuery = [
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
  validateMaterialRequest,
  validateMaterialReview,
  validateMaterialId,
  validateMaterialQuery,
};
