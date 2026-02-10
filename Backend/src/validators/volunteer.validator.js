import { body } from "express-validator";

export const volunteerApplicationValidation = [
  body("firstName").notEmpty().withMessage("First name is required").trim(),
  body("lastName").notEmpty().withMessage("Last name is required").trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("phone").notEmpty().withMessage("Phone number is required").trim(),
  body("availability").optional(),
  body("interests").optional(),
];
