import { body, query } from "express-validator";

export const initializeDonationValidation = [
  body("amount").custom((val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 100)
      throw new Error("Minimum donation amount is ₦100");
    if (num > 10000000)
      throw new Error("Maximum donation amount is ₦10,000,000");
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
    .optional({ values: "falsy" }) // accept missing, null, undefined, or empty string
    .trim()
    .custom((val) => {
      // Only enforce length when a non-empty string is actually provided
      if (val && val.length > 0 && val.length < 5) {
        throw new Error("Notes must be at least 5 characters");
      }
      return true;
    }),
];

export const rejectionValidation = [
  body("rejectionReason")
    .notEmpty()
    .withMessage("Rejection reason is required")
    .trim(),
];
