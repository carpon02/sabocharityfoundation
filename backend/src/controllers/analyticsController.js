// controllers/analyticsController.js - UPDATED WITH USER ANALYTICS
import { Parser } from "json2csv";
import User from "../models/User.js";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import Event from "../models/Event.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc Get overall platform analytics
 * @route GET /api/v1/analytics
 * @access Private/Admin
 */
export const getPlatformAnalytics = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalCampaigns = await Campaign.countDocuments();
  const totalDonations = await Donation.countDocuments({ status: "completed" });
  const totalEvents = await Event.countDocuments();

  const totalRaisedResult = await Donation.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);

  const totalRaised = totalRaisedResult[0]?.total || 0;
  const totalCompletedDonationsCount = totalRaisedResult[0]?.count || 0;
  const averageRaised =
    totalCompletedDonationsCount > 0
      ? totalRaised / totalCompletedDonationsCount
      : 0;

  const totalActiveCampaigns = await Campaign.countDocuments({
    status: "active",
  });
  const totalCompletedCampaigns = await Campaign.countDocuments({
    status: "completed",
  });

  // Calculate unique donors
  const uniqueDonors = await Donation.distinct("donor", {
    status: "completed",
  });
  const totalDonors = uniqueDonors.length;

  // Calculate Geo-Impact (Campaign Distribution by Country)
  const geoImpactStats = await Campaign.aggregate([
    { $match: { status: "active" } },
    {
      $group: {
        _id: "$location.country",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const totalActiveForGeo = geoImpactStats.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );
  const geoImpact = geoImpactStats.map((stat) => ({
    label: stat._id || "Unknown",
    value: Math.round((stat.count / (totalActiveForGeo || 1)) * 100),
    color: "bg-indigo-500", // Default color, frontend can map this
  }));

  const analytics = {
    totalUsers,
    totalCampaigns,
    totalActiveCampaigns,
    totalCompletedCampaigns,
    totalDonations,
    totalEvents,
    totalRaised,
    amountRaised: totalRaised,
    totalAmount: totalRaised,
    totalDonors,
    averageRaised,
    geoImpact,
  };

  ApiResponse.success(
    res,
    "Platform analytics fetched successfully",
    analytics,
  );
});

/**
 * @desc Get public overview analytics
 * @route GET /api/v1/analytics/overview
 * @access Public
 */
export const getOverviewAnalytics = asyncHandler(async (req, res, next) => {
  const totalCampaigns = await Campaign.countDocuments({
    status: "active",
    approved: true,
  });
  const totalDonations = await Donation.countDocuments({ status: "completed" });

  const totalRaised = await Donation.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  // Mocking some values that aren't in DB yet but needed for UI
  const analytics = {
    totalCampaigns,
    totalDonations,
    totalRaised: totalRaised[0]?.total || 0,
    livesImpacted: (totalRaised[0]?.total || 0) / 1000 + 500, // simple heuristic for demo
    activeVolunteers: totalDonations * 2 + 10,
  };

  ApiResponse.success(
    res,
    "Overview analytics fetched successfully",
    analytics,
  );
});

/**
 * @desc Get campaign performance analytics
 * @route GET /api/v1/analytics/campaigns
 * @access Private/Admin
 */
export const getCampaignAnalytics = asyncHandler(async (req, res, next) => {
  const stats = await Campaign.aggregate([
    {
      $group: {
        _id: "$category",
        totalCampaigns: { $sum: 1 },
        totalTarget: { $sum: "$targetAmount" },
        totalRaised: { $sum: "$raisedAmount" },
      },
    },
    { $sort: { totalCampaigns: -1 } },
  ]);

  ApiResponse.success(res, "Campaign analytics fetched successfully", stats);
});

/**
 * @desc Get donation trends (last 6 months)
 * @route GET /api/v1/analytics/donations
 * @access Private/Admin
 */
export const getDonationTrends = asyncHandler(async (req, res, next) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const donationTrends = await Donation.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, status: "completed" } },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        amount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedTrends = donationTrends.map((trend) => ({
    month: monthNames[trend._id.month - 1],
    amount: trend.amount,
    count: trend.count,
    date: new Date(trend._id.year, trend._id.month - 1, 1),
  }));

  ApiResponse.success(
    res,
    "Donation trends fetched successfully",
    formattedTrends,
  );
});

/**
 * @desc Get event participation statistics
 * @route GET /api/v1/analytics/events
 * @access Private/Admin
 */
export const getEventAnalytics = asyncHandler(async (req, res, next) => {
  const upcoming = await Event.countDocuments({ date: { $gte: new Date() } });
  const past = await Event.countDocuments({ date: { $lt: new Date() } });

  const eventStats = await Event.aggregate([
    {
      $group: {
        _id: "$category",
        totalEvents: { $sum: 1 },
        totalAttendees: { $sum: "$attendeesCount" },
      },
    },
  ]);

  ApiResponse.success(res, "Event analytics fetched successfully", {
    totalUpcoming: upcoming,
    totalPast: past,
    categoryStats: eventStats,
  });
});

/**
 * @desc Get user-specific dashboard analytics
 * @route GET /api/v1/analytics/user
 * @access Private (User/Donor)
 */
export const getUserAnalytics = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Total donated by user
  const totalDonated = await Donation.aggregate([
    { $match: { donor: userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  // User's campaigns created (if organizer)
  const campaignsCreated = await Campaign.countDocuments({ organizer: userId });

  // Events attended by user (assuming Event has attendees array)
  const eventsAttended = await Event.aggregate([
    { $match: { attendees: userId } },
    { $count: "total" },
  ]);

  // Impact score (simple calculation: e.g., donations * 0.1 + campaigns * 50 + events * 20)
  const impactScore =
    (totalDonated[0]?.total || 0) * 0.1 +
    campaignsCreated * 50 +
    (eventsAttended[0]?.total || 0) * 20;

  // Current month donations
  const currentMonth = new Date();
  const yearStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );
  const monthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );
  const monthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  );

  const currentMonthDonations = await Donation.aggregate([
    {
      $match: {
        donor: userId,
        createdAt: { $gte: monthStart, $lte: monthEnd },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  // Monthly goal (hardcoded or from user profile; assume 20000 for demo)
  const monthlyGoal = 20000;

  // Recent activity (Combined feed: Donations + Event Registrations)
  const recentActivities = await Donation.aggregate([
    { $match: { donor: userId } },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "campaigns",
        localField: "campaign",
        foreignField: "_id",
        as: "campaign",
      },
    },
    { $unwind: { path: "$campaign", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        id: "$_id",
        type: { $literal: "donation" },
        title: { $ifNull: ["$campaign.title", "Unknown Campaign"] },
        amount: 1,
        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        status: 1,
      },
    },
  ]);

  // Fetch recent event registrations as activities
  const registeredEvents = await Event.aggregate([
    { $match: { attendees: userId } },
    { $sort: { date: -1 } },
    { $limit: 5 },
    {
      $project: {
        id: "$_id",
        type: { $literal: "event" },
        title: "$name",
        location: 1,
        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        status: { $literal: "registered" },
      },
    },
  ]);

  // Combine and sort activities
  const allActivities = [...recentActivities, ...registeredEvents]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  // Discovery: Top 3 Urgent Campaigns NOT supported by the user
  const supportedCampaignIds = await Donation.distinct("campaign", {
    donor: userId,
  });
  const discoveryCampaigns = await Campaign.find({
    _id: { $nin: supportedCampaignIds },
    status: "active",
    approved: true,
    endDate: { $gt: new Date() },
  })
    .sort({ endDate: 1, raisedAmount: -1 })
    .limit(3)
    .select(
      "_id title raisedAmount targetAmount donorsCount endDate image category",
    );

  // Impact metrics (platform-wide, personalized)
  const impactMetrics = [
    { label: "People Helped", value: Math.floor(impactScore / 10), growth: 12 },
    {
      label: "Meals Provided",
      value: Math.floor((totalDonated[0]?.total || 0) / 500),
      growth: 8,
    },
    { label: "Books Donated", value: campaignsCreated * 100, growth: 15 },
    {
      label: "Trees Planted",
      value: eventsAttended[0]?.total * 10 || 0,
      growth: 23,
    },
  ];

  // Donor Tier
  let tier = "Contributor";
  if (impactScore > 5000) tier = "Hero";
  else if (impactScore > 2000) tier = "Guardian";
  else if (impactScore > 1000) tier = "Advocate";

  // Active Campaigns (Top 3 active ones)
  const activeCampaigns = await Campaign.find({
    status: "active",
    approved: true,
  })
    .sort({ createdAt: -1 })
    .limit(3);

  // Upcoming Events (Top 3 upcoming ones)
  const upcomingEvents = await Event.find({
    eventDate: { $gt: new Date() },
    status: "published",
  })
    .sort({ eventDate: 1 })
    .limit(3);

  const analytics = {
    user: {
      totalDonated: totalDonated[0]?.total || 0,
      campaignsCreated,
      eventsAttended: eventsAttended[0]?.total || 0,
      impactScore: Math.floor(impactScore),
      monthlyGoal,
      currentMonthDonations: currentMonthDonations[0]?.total || 0,
      donorTier: tier,
    },
    recentActivities: allActivities,
    activeCampaigns,
    upcomingEvents,
    discoveryCampaigns,
    impactMetrics,
  };

  ApiResponse.success(res, "User analytics fetched successfully", analytics);
});

/**
 * @desc Export donations as CSV
 * @route GET /api/v1/analytics/export/donations
 * @access Private/Admin
 */
export const exportDonationsCsv = asyncHandler(async (req, res, next) => {
  const donations = await Donation.find()
    .populate("donor", "firstName lastName email")
    .sort({ createdAt: -1 });

  const fields = [
    { label: "Donation ID", value: "_id" },
    { label: "Amount", value: "amount" },
    { label: "Currency", value: "currency" },
    { label: "Status", value: "status" },
    { label: "Recurring", value: "isRecurring" },
    { label: "Donor First Name", value: "donor.firstName" },
    { label: "Donor Last Name", value: "donor.lastName" },
    { label: "Donor Email", value: "donor.email" },
    { label: "Date", value: "createdAt" },
  ];
  
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(donations);
    
    res.header("Content-Type", "text/csv");
    res.attachment("donations-export.csv");
    return res.send(csv);
  } catch (err) {
    return next(new ApiError("Could not generate CSV", 500));
  }
});

export default {
  getPlatformAnalytics,
  getCampaignAnalytics,
  getDonationTrends,
  getEventAnalytics,
  getUserAnalytics,
  exportDonationsCsv,
};
