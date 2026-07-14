import { body, param, query } from "express-validator";

const validateAddExpense = [
  body("paymentRequestId")
    .notEmpty()
    .withMessage("Payment request ID is required")
    .isMongoId()
    .withMessage("Invalid payment request ID"),

  body("purpose")
    .notEmpty()
    .withMessage("Expense purpose is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Expense purpose must be between 2 and 200 characters"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
];

const validateExpenseId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid payment request ID"),
];

const validateExpenseQuery = [
  query("search")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),
];

export {
  validateAddExpense,
  validateExpenseId,
  validateExpenseQuery,
};
