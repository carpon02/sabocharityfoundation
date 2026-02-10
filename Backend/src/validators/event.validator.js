import { body } from "express-validator";

export const createEventValidation = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("description").notEmpty().withMessage("Description is required").trim(),
  body("eventDate")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("location.venue").notEmpty().withMessage("Venue is required").trim(),
  body("category").notEmpty().withMessage("Category is required").trim(),
];

export const updateEventValidation = [
  body("title").optional().trim(),
  body("description").optional().trim(),
  body("date").optional().isISO8601().withMessage("Invalid date format"),
  body("location").optional().trim(),
];
