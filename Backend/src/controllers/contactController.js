import Contact from "../models/Contact.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Submit contact message
// @route   POST /api/v1/contact
// @access  Public
export const submitContactForm = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, phone, email, message, agreedToTerms } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !email ||
    !message ||
    agreedToTerms !== true
  ) {
    return next(
      new ApiError("All fields are required and you must agree to terms", 400)
    );
  }

  const contact = await Contact.create({
    firstName,
    lastName,
    phone,
    email,
    message,
    agreedToTerms,
  });
  ApiResponse.created(res, "Message sent successfully", { contact });
});

// @desc    Get all contact messages
// @route   GET /api/v1/contact
// @access  Private/Admin
export const getAllContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find().sort("-createdAt");
  ApiResponse.success(res, "Contact messages fetched successfully", {
    contacts,
  });
});

// @desc    Get single contact message
// @route   GET /api/v1/contact/:id
// @access  Private/Admin
export const getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id).populate(
    "repliedBy",
    "firstName lastName email"
  );

  if (!contact) {
    return next(new ApiError("Message not found", 404));
  }

  ApiResponse.success(res, "Message fetched successfully", { contact });
});

// @desc    Mark contact message as read
// @route   PATCH /api/v1/contact/:id/read
// @access  Private/Admin
export const markAsRead = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ApiError("Message not found", 404));
  }

  contact.status = "read";
  await contact.save();

  ApiResponse.success(res, "Message marked as read", { contact });
});

// @desc    Reply to contact message
// @route   PATCH /api/v1/contact/:id/reply
// @access  Private/Admin
export const replyToContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ApiError("Message not found", 404));
  }

  contact.status = "replied";
  contact.repliedBy = req.user.id;
  contact.repliedAt = new Date();
  await contact.save();

  ApiResponse.success(res, "Message marked as replied", { contact });
});

// @desc    Delete contact message
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
export const deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ApiError("Message not found", 404));
  }

  await contact.deleteOne();
  ApiResponse.success(res, "Message deleted successfully");
});
