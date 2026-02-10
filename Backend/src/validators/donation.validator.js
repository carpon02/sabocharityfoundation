import { body, query } from "express-validator";

export const initializeDonationValidation = [
  body("amount").custom((val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 100)
      throw new Error("Minimum donation amount is ₦100");
    return true;
  }),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("campaignId")
    .notEmpty()
    .withMessage("Campaign ID is required")
    .isMongoId()
    .withMessage("Invalid Campaign ID"),
  body("paymentMethod")
    .isIn(["card", "bank_transfer", "ussd"])
    .withMessage("Invalid payment method"),
];

export const adminActionValidation = [
  body("adminNotes")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Notes must be at least 5 characters"),
];

export const rejectionValidation = [
  body("rejectionReason")
    .notEmpty()
    .withMessage("Rejection reason is required")
    .trim(),
];
