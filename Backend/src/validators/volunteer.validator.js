import { body } from "express-validator";

export const volunteerApplicationValidation = [
  // Personal Info — nested under personalInfo object
  body("personalInfo.firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim(),
  body("personalInfo.lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .trim(),
  body("personalInfo.email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("personalInfo.phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .trim(),

  // Volunteer Preferences — required by the Mongoose model
  body("volunteerPreferences.availability")
    .notEmpty()
    .withMessage("Availability is required")
    .isIn(["weekdays", "weekends", "flexible", "specific_days"])
    .withMessage("Invalid availability option"),
  body("volunteerPreferences.timeCommitment")
    .notEmpty()
    .withMessage("Time commitment is required")
    .isIn(["1-5_hours", "5-10_hours", "10-20_hours", "20+_hours"])
    .withMessage("Invalid time commitment option"),

  // Consent — required by the Mongoose model
  body("consentGiven.dataProcessing")
    .optional()
    .isBoolean()
    .withMessage("Data processing consent must be a boolean"),
];
