import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map((err) => err.msg);
    const message = `Validation Error: ${errorMessages.join(". ")}`;

    // Pass to global error handler
    next(new ApiError(message, 400));
  };
};
