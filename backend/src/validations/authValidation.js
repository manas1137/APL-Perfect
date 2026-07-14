import { body } from "express-validator";

const validateLogin = [
  body("identifier")
    .notEmpty()
    .withMessage("Username or email is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username or email must be between 3 and 50 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be at least 6 characters"),
];

export { validateLogin };
