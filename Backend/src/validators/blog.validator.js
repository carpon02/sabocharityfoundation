import { body } from "express-validator";

export const createBlogValidation = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("content").notEmpty().withMessage("Content is required"),
  body("category").notEmpty().withMessage("Category is required").trim(),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Invalid status"),
];
