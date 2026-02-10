import asyncHandler from "../utils/asyncHandler.js";
import Volunteer from "../models/Volunteer.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Pagination from "../utils/pagination.js";
import { sendEmail } from "../services/emailService.js";
import mongoose from "mongoose";

// @desc    Create a new volunteer application
// @route   POST /api/v1/volunteers
// @access  Public
export const createVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.create(req.body);

  res.status(201).json({
    success: true,
    message: "Volunteer application submitted successfully",
    data: volunteer,
  });
});

// @desc    Get all volunteers (Admin)
// @route   GET /api/v1/volunteers
// @access  Private/Admin
export const getAllVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await Volunteer.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: volunteers.length,
    data: volunteers,
  });
});

// @desc    Get a single volunteer by ID
// @route   GET /api/v1/volunteers/:id
// @access  Private/Admin
export const getVolunteerById = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id).populate(
    "user",
    "name email role"
  );

  if (!volunteer) {
    throw new ApiError("Volunteer not found", 404);
  }

  res.status(200).json({
    success: true,
    data: volunteer,
  });
});

// @desc    Update volunteer application
// @route   PUT /api/v1/volunteers/:id
// @access  Private/Admin
export const updateVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    throw new ApiError("Volunteer not found", 404);
  }

  // Merge updates
  Object.assign(volunteer, req.body);
  const updatedVolunteer = await volunteer.save();

  res.status(200).json({
    success: true,
    message: "Volunteer application updated successfully",
    data: updatedVolunteer,
  });
});

// @desc    Delete a volunteer application
// @route   DELETE /api/v1/volunteers/:id
// @access  Private/Admin
export const deleteVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    throw new ApiError("Volunteer not found", 404);
  }

  await volunteer.deleteOne();

  res.status(200).json({
    success: true,
    message: "Volunteer application deleted successfully",
  });
});

// @desc    Approve volunteer application
// @route   POST /api/v1/volunteers/:id/approve
// @access  Private/Admin
export const approveVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    throw new ApiError("Volunteer not found", 404);
  }

  await volunteer.approve(req.user._id);

  res.status(200).json({
    success: true,
    message: "Volunteer approved successfully",
    data: volunteer,
  });
});

// @desc    Reject volunteer application
// @route   POST /api/v1/volunteers/:id/reject
// @access  Private/Admin
export const rejectVolunteer = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError("Rejection reason is required", 400);
  }

  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    throw new ApiError("Volunteer not found", 404);
  }

  await volunteer.reject(reason);

  res.status(200).json({
    success: true,
    message: "Volunteer rejected successfully",
    data: volunteer,
  });
});

// @desc    Log volunteer activity
// @route   POST /api/v1/volunteers/:id/log-activity
// @access  Private/Admin
export const logVolunteerActivity = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    throw new ApiError("Volunteer not found", 404);
  }

  const activityData = req.body; // { campaign, event, description, hoursWorked, date, supervisedBy, notes }
  await volunteer.logActivity(activityData);

  res.status(200).json({
    success: true,
    message: "Volunteer activity logged successfully",
    data: volunteer,
  });
});
