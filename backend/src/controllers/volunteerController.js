import asyncHandler from "../utils/asyncHandler.js";
import Volunteer from "../models/Volunteer.js";
import ApiError from "../utils/ApiError.js";
import Notification from "../models/Notification.js";

/**
 * Returns a deep copy of `obj` with all empty-string values removed.
 * Prevents Mongoose from receiving "" for optional enum/Boolean fields.
 */
const stripEmptyStrings = (value) => {
  if (Array.isArray(value)) {
    return value.map(stripEmptyStrings);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== "")
        .map(([k, v]) => [k, stripEmptyStrings(v)])
    );
  }
  return value;
};

/**
 * Validates the required fields of a volunteer application payload.
 * Returns an array of error messages (empty if valid).
 */
const validateApplication = ({ personalInfo, volunteerPreferences } = {}) => {
  const errors = [];
  if (!personalInfo?.firstName?.trim()) errors.push("First name is required");
  if (!personalInfo?.lastName?.trim())  errors.push("Last name is required");
  if (!personalInfo?.email?.trim())     errors.push("Email is required");
  if (!personalInfo?.phone?.trim())     errors.push("Phone number is required");
  if (!volunteerPreferences?.availability)   errors.push("Availability is required");
  if (!volunteerPreferences?.timeCommitment) errors.push("Time commitment is required");
  return errors;
};

// ──────────────────────────────────────────────────────────────
// @desc    Create a new volunteer application
// @route   POST /api/v1/volunteers
// @access  Public
// ──────────────────────────────────────────────────────────────
export const createVolunteer = asyncHandler(async (req, res) => {
  const errors = validateApplication(req.body);
  if (errors.length) throw new ApiError(errors.join(". "), 400);

  const cleanData = stripEmptyStrings(req.body);

  const volunteer = await Volunteer.create(cleanData);

  await Notification.create({
    title: "New Volunteer Application",
    message: `${volunteer.personalInfo.firstName} ${volunteer.personalInfo.lastName} has applied to be a volunteer.`,
    type: "volunteer",
    link: "/admin/volunteers",
    recipientRole: "super_admin",
  });

  res.status(201).json({
    success: true,
    message: "Volunteer application submitted successfully",
    data: volunteer,
  });
});

// ──────────────────────────────────────────────────────────────
// @desc    Get all volunteers
// @route   GET /api/v1/volunteers
// @access  Private/Admin
// ──────────────────────────────────────────────────────────────
export const getAllVolunteers = asyncHandler(async (req, res) => {
  const { status, search, applicationType } = req.query;

  const conditions = [];

  // Filter by status
  if (status) {
    conditions.push({ applicationStatus: status });
  }

  // Filter by application type (volunteer vs ambassador)
  if (applicationType) {
    if (applicationType === "volunteer") {
      conditions.push({
        $or: [
          { applicationType: "volunteer" },
          { applicationType: { $exists: false } },
          { applicationType: null },
        ],
      });
    } else {
      conditions.push({ applicationType });
    }
  }

  // Filter by search query across firstName, lastName, email, phone
  if (search && search.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedSearch, "i");
    conditions.push({
      $or: [
        { "personalInfo.firstName": regex },
        { "personalInfo.lastName": regex },
        { "personalInfo.email": regex },
        { "personalInfo.phone": regex },
      ],
    });
  }

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  const volunteers = await Volunteer.find(filter)
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
});

// ──────────────────────────────────────────────────────────────
// @desc    Get single volunteer by ID
// @route   GET /api/v1/volunteers/:id
// @access  Private/Admin
// ──────────────────────────────────────────────────────────────
export const getVolunteerById = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id).populate("user", "name email role");
  if (!volunteer) throw new ApiError("Volunteer not found", 404);

  res.status(200).json({ success: true, data: volunteer });
});

// ──────────────────────────────────────────────────────────────
// @desc    Update volunteer application
// @route   PUT /api/v1/volunteers/:id
// @access  Private/Admin
// ──────────────────────────────────────────────────────────────
export const updateVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) throw new ApiError("Volunteer not found", 404);

  Object.assign(volunteer, req.body);
  const updated = await volunteer.save();

  res.status(200).json({ success: true, message: "Volunteer updated successfully", data: updated });
});

// ──────────────────────────────────────────────────────────────
// @desc    Delete volunteer application
// @route   DELETE /api/v1/volunteers/:id
// @access  Private/Admin
// ──────────────────────────────────────────────────────────────
export const deleteVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) throw new ApiError("Volunteer not found", 404);

  await volunteer.deleteOne();

  res.status(200).json({ success: true, message: "Volunteer application deleted successfully" });
});

// ──────────────────────────────────────────────────────────────
// @desc    Approve volunteer application
// @route   POST /api/v1/volunteers/:id/approve
// @access  Private/Admin
// ──────────────────────────────────────────────────────────────
export const approveVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) throw new ApiError("Volunteer not found", 404);

  await volunteer.approve(req.user._id);

  res.status(200).json({ success: true, message: "Volunteer approved successfully", data: volunteer });
});

// ──────────────────────────────────────────────────────────────
// @desc    Reject volunteer application
// @route   POST /api/v1/volunteers/:id/reject
// @access  Private/Admin
// ──────────────────────────────────────────────────────────────
export const rejectVolunteer = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) throw new ApiError("Rejection reason is required", 400);

  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) throw new ApiError("Volunteer not found", 404);

  await volunteer.reject(reason);

  res.status(200).json({ success: true, message: "Volunteer rejected successfully", data: volunteer });
});

// ──────────────────────────────────────────────────────────────
// @desc    Log volunteer activity
// @route   POST /api/v1/volunteers/:id/log-activity
// @access  Private/Admin
// ──────────────────────────────────────────────────────────────
export const logVolunteerActivity = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) throw new ApiError("Volunteer not found", 404);

  await volunteer.logActivity(req.body);

  res.status(200).json({ success: true, message: "Activity logged successfully", data: volunteer });
});
