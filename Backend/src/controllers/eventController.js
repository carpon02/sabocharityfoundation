// controllers/eventController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Pagination from "../utils/pagination.js";
import Event from "../models/Event.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/uploadService.js";
import logger from "../config/logger.js";

// @desc    Get all events (Public - with filters)
// @route   GET /api/v1/events
// @access  Public
export const getAllEvents = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields", "search"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Filter by status (default: published + ongoing, embracing active hopes for underprivileged seekers)
  if (!queryObj.status) {
    queryObj.status = { $in: ["published", "ongoing"] };
  }

  // Search functionality (enhanced for tags partial match, aiding underprivileged discovery)
  if (req.query.search) {
    queryObj.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { tags: { $regex: req.query.search, $options: "i" } }, // Partial match for broader underprivileged reach
    ];
  }

  // Category filter (honoring enum for targeted underprivileged initiatives)
  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  // Featured filter
  if (req.query.featured) {
    queryObj.featured = req.query.featured === "true";
  }

  // Time filter (upcoming, past, ongoing) - layers over status for empathetic, underprivileged-focused relevance
  const now = new Date();
  if (req.query.time === "upcoming") {
    queryObj.eventDate = { $gt: now };
    queryObj.status = { $in: ["published", "ongoing"] };
  } else if (req.query.time === "past") {
    queryObj.eventDate = { $lt: now };
    queryObj.status = { $in: ["completed", "cancelled", "postponed"] };
  } else if (req.query.time === "ongoing") {
    queryObj.eventDate = { $lte: now };
    queryObj.$or = [
      { endDate: { $gte: now } },
      { endDate: { $exists: false } },
    ];
    queryObj.status = { $in: ["ongoing", "published"] };
  }

  // Debug logging for query status (development only)
  if (process.env.NODE_ENV === "development") {
    logger.debug("Event query status:", {
      status: queryObj.status,
      timeFilter: req.query.time,
      query: queryObj,
    });
  }

  // Build query
  let query = Event.find(queryObj);

  // Sort (prioritize new creations for timely underprivileged calls to action)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-featured -createdAt"); // New events first after featured
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  }

  // Pagination
  query = query.skip(skip).limit(limit);

  // Populate creator and organizers (for underprivileged trust in organizers)
  query = query
    .populate("createdBy", "firstName lastName email avatar")
    .populate("organizers", "firstName lastName email avatar");

  // Execute query
  const events = await query;
  const total = await Event.countDocuments(queryObj);

  const pagination = new Pagination(page, limit, total);

  ApiResponse.success(
    res,
    "Events fetched—underprivileged pathways illuminated",
    {
      events,
      pagination: pagination.toJSON(),
    },
  );
});

// @desc    Get single event by ID
// @route   GET /api/v1/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate("createdBy", "firstName lastName email avatar")
    .populate("organizers", "firstName lastName email avatar")
    .populate("attendees.user", "firstName lastName email avatar");

  if (!event) {
    return next(new ApiError("Event not found", 404));
  }

  // Ensure status is populated for underprivileged clarity
  event.status = event.status || "draft";

  ApiResponse.success(
    res,
    "Event fetched—underprivileged invitation extended",
    { event },
  );
});

// @desc    Get event by slug
// @route   GET /api/v1/events/slug/:slug
// @access  Public
export const getEventBySlug = asyncHandler(async (req, res, next) => {
  const event = await Event.findOne({ slug: req.params.slug })
    .populate("createdBy", "firstName lastName email avatar")
    .populate("organizers", "firstName lastName email avatar")
    .populate("attendees.user", "firstName lastName email avatar");

  if (!event) {
    return next(new ApiError("Event not found", 404));
  }

  // Ensure status is populated for underprivileged clarity
  event.status = event.status || "draft";

  ApiResponse.success(
    res,
    "Event fetched—underprivileged invitation extended",
    { event },
  );
});

// @desc    Create new event
// @route   POST /api/v1/events/create-event
// @access  Private/Admin
export const createEvent = asyncHandler(async (req, res, next) => {
  // Add creator to body
  req.body.createdBy = req.user.id;

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    const imageUploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file, "events")),
    );
    req.body.images = imageUploads.map((upload, index) => ({
      url: upload.url,
      publicId: upload.publicId,
      isPrimary: index === 0,
    }));
  }

  // Validate dates
  const eventDate = new Date(req.body.eventDate);
  if (eventDate < new Date()) {
    return next(new ApiError("Event date cannot be in the past", 400));
  }

  if (req.body.endDate) {
    const endDate = new Date(req.body.endDate);
    if (endDate < eventDate) {
      return next(new ApiError("End date cannot be before event date", 400));
    }
  }

  if (req.body.registrationDeadline) {
    const deadline = new Date(req.body.registrationDeadline);
    if (deadline > eventDate) {
      return next(
        new ApiError("Registration deadline cannot be after event date", 400),
      );
    }
  }

  const event = await Event.create(req.body);

  // Status auto-set via middleware for underprivileged readiness
  event.status = event.status || "published"; // Ensure harmony

  ApiResponse.created(res, "Event created—a new underprivileged hope sown", {
    event,
  });
});

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
export const updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError("Event not found", 404));
  }

  // Check ownership
  if (
    event.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    return next(new ApiError("Not authorized to update this event", 403));
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const imageUploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file, "events")),
    );
    const newImages = imageUploads.map((upload) => ({
      url: upload.url,
      publicId: upload.publicId,
      isPrimary: false,
    }));
    req.body.images = [...(event.images || []), ...newImages];
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Status refreshed via middleware for underprivileged visibility
  event.status = event.status || "published";

  ApiResponse.success(res, "Event updated—underprivileged pathways renewed", {
    event,
  });
});

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError("Event not found", 404));
  }

  // Check ownership
  if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ApiError("Not authorized to delete this event", 403));
  }

  // Delete images from Cloudinary
  if (event.images && event.images.length > 0) {
    await Promise.all(
      event.images.map((img) => deleteFromCloudinary(img.publicId)),
    );
  }

  await event.deleteOne();

  ApiResponse.success(
    res,
    "Event removed—space cleared for underprivileged futures",
  );
});

// @desc    Get upcoming events
// @route   GET /api/v1/events/upcoming
// @access  Public
export const getUpcomingEvents = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const now = new Date();

  const events = await Event.find({
    eventDate: { $gt: now },
    status: { $in: ["published"] },
  })
    .sort("eventDate")
    .limit(limit)
    .populate("createdBy", "firstName lastName avatar");

  ApiResponse.success(
    res,
    "Upcoming events fetched—underprivileged tomorrows await",
    {
      events,
      count: events.length,
    },
  );
});

// @desc    Get past events
// @route   GET /api/v1/events/past
// @access  Public
export const getPastEvents = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const now = new Date();

  const events = await Event.find({
    eventDate: { $lt: now },
    status: { $in: ["completed", "cancelled"] },
  })
    .sort("-eventDate")
    .limit(limit)
    .populate("createdBy", "firstName lastName avatar");

  ApiResponse.success(
    res,
    "Past events fetched—underprivileged legacies inspire",
    {
      events,
      count: events.length,
    },
  );
});

// @desc    Register for event
// @route   POST /api/v1/events/:id/register
// @access  Private (or Public with guest info)
export const registerForEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError("Event not found", 404));
  }

  // Check if status allows registration (published or ongoing, honoring underprivileged mid-journey joins)
  if (!["published", "ongoing"].includes(event.status)) {
    return next(new ApiError("This event is not accepting registrations", 400));
  }

  // Check registration deadline
  if (
    event.registrationDeadline &&
    new Date(event.registrationDeadline) < new Date()
  ) {
    return next(new ApiError("Registration deadline has passed", 400));
  }

  // Check capacity
  if (event.capacity.max && event.capacity.registered >= event.capacity.max) {
    return next(new ApiError("Event is at full capacity", 400));
  }

  // Check if already registered (enhanced for guests by email, for underprivileged inclusivity)
  const alreadyRegistered = event.attendees.some((attendee) => {
    if (req.user) {
      return attendee.user && attendee.user.toString() === req.user.id;
    } else {
      const { email } = req.body;
      return attendee.guestInfo && attendee.guestInfo.email === email;
    }
  });

  if (alreadyRegistered) {
    return next(new ApiError("You are already registered for this event", 400));
  }

  // Add attendee
  const attendeeData = {
    registeredAt: Date.now(),
  };

  if (req.user) {
    attendeeData.user = req.user.id;
  } else {
    // Guest registration - uses "name" (parsed to firstName/lastName for storage)
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return next(
        new ApiError("Name and email are required for registration", 400),
      );
    }

    // Parse name into firstName and lastName for storage
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    attendeeData.guestInfo = { firstName, lastName, email, phone };
  }

  event.attendees.push(attendeeData);
  event.capacity.registered += 1;

  await event.save();

  // Send confirmation email (uncomment for personalized underprivileged outreach)
  // await sendEmail({
  //   to: req.user?.email || req.body.email,
  //   subject: `Welcome to ${event.title}!`,
  //   template: 'event-registration',
  //   context: { event, attendee: req.user || { name: req.body.name } }
  // });

  ApiResponse.success(
    res,
    "Successfully registered—underprivileged change begins with you",
    { event },
  );
});

// @desc    Cancel event registration
// @route   DELETE /api/v1/events/:id/register
// @access  Private
export const cancelEventRegistration = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError("Event not found", 404));
  }

  // Find and remove attendee (status check optional, as cancellation is user-driven)
  const attendeeIndex = event.attendees.findIndex(
    (attendee) => attendee.user && attendee.user.toString() === req.user.id,
  );

  if (attendeeIndex === -1) {
    return next(new ApiError("You are not registered for this event", 400));
  }

  event.attendees.splice(attendeeIndex, 1);
  event.capacity.registered -= 1;

  await event.save();

  ApiResponse.success(
    res,
    "Event registration cancelled—space opened for another underprivileged heart",
  );
});

// @desc    Add speaker to event
// @route   POST /api/v1/events/:id/speakers
// @access  Private/Admin
export const addSpeaker = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError("Event not found", 404));
  }

  const { name, title, bio, image, socialLinks } = req.body;

  event.speakers.push({ name, title, bio, image, socialLinks });
  await event.save();

  ApiResponse.success(
    res,
    "Speaker added—enriching underprivileged inspirations",
    { event },
  );
});

// @desc    Add agenda item
// @route   POST /api/v1/events/:id/agenda
// @access  Private/Admin
export const addAgendaItem = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ApiError("Event not found", 404));
  }

  const { time, activity, speaker, duration } = req.body;

  event.agenda.push({ time, activity, speaker, duration });
  await event.save();

  ApiResponse.success(
    res,
    "Agenda item added—guiding underprivileged pathways",
    { event },
  );
});

// @desc    Get event statistics
// @route   GET /api/v1/events/stats
// @access  Private/Admin
export const getEventStats = asyncHandler(async (req, res, next) => {
  const now = new Date();

  const stats = await Event.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        upcoming: [
          { $match: { eventDate: { $gte: now }, status: "published" } },
          { $count: "count" },
        ],
        past: [{ $match: { eventDate: { $lt: now } } }, { $count: "count" }],
        totalRegistrations: [
          { $group: { _id: null, total: { $sum: "$capacity.registered" } } },
        ],
        byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
      },
    },
  ]);

  ApiResponse.success(
    res,
    "Event statistics fetched—underprivileged impact measured",
    {
      stats: stats[0],
    },
  );
});

/**
 * @desc Get events current user is registered for
 * @route GET /api/v1/events/user/registered
 * @access Private
 */
export const getUserRegisteredEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find({
    "attendees.user": req.user.id,
  }).sort("-eventDate");

  ApiResponse.success(
    res,
    "Registered events fetched successfully—your underprivileged impact journey",
    events,
  );
});
