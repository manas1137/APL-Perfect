import { body, param } from "express-validator";

const validateMaterialCreate = [
  body("name")
    .notEmpty()
    .withMessage("Material name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Material name must be between 2 and 100 characters")
    .trim(),

  body("unitPrice")
    .notEmpty()
    .withMessage("Unit price is required")
    .isFloat({ min: 0 })
    .withMessage("Unit price must be a positive number"),

  body("unit")
    .notEmpty()
    .withMessage("Unit is required")
    .isIn([
      "kg",
      "liter",
      "piece",
      "bag",
      "meter",
      "sqft",
      "cubic_feet",
      "ton",
      "dozen",
      "other",
    ])
    .withMessage("Invalid unit"),

  body("note")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters")
    .trim(),
];

const validateMaterialUpdate = [
  param("id")
    .isMongoId()
    .withMessage("Invalid material ID"),

  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Material name must be between 2 and 100 characters")
    .trim(),

  body("unitPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Unit price must be a positive number"),

  body("unit")
    .optional()
    .isIn([
      "kg",
      "liter",
      "piece",
      "bag",
      "meter",
      "sqft",
      "cubic_feet",
      "ton",
      "dozen",
      "other",
    ])
    .withMessage("Invalid unit"),

  body("note")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Note cannot exceed 500 characters")
    .trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const validateMaterialId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid material ID"),
];

export {
  validateMaterialCreate,
  validateMaterialUpdate,
  validateMaterialId,
};
