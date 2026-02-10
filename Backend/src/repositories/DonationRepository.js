/**
 * Donation Repository
 * Data access layer for Donation model
 */
import mongoose from "mongoose";
import { BaseRepository } from "./BaseRepository.js";
import Donation from "../models/Donation.js";

class DonationRepository extends BaseRepository {
  constructor() {
    super(Donation);
  }

  /**
   * Find donation by payment reference
   */
  async findByPaymentReference(reference, options = {}) {
    return await this.findOne({ paymentReference: reference }, options);
  }

  /**
   * Find donation by Paystack reference
   */
  async findByPaystackReference(reference, options = {}) {
    return await this.findOne({ paystackReference: reference }, options);
  }

  /**
   * Find donations by campaign
   */
  async findByCampaign(campaignId, options = {}) {
    return await this.find({ campaign: campaignId }, options);
  }

  /**
   * Find donations by donor
   */
  async findByDonor(donorId, options = {}) {
    return await this.find({ donor: donorId }, options);
  }

  /**
   * Find donations by status
   */
  async findByStatus(status, options = {}) {
    return await this.find({ status }, options);
  }

  /**
   * Find donations requiring approval
   */
  async findPendingApproval(options = {}) {
    return await this.find(
      {
        approvalStatus: "pending",
        status: { $in: ["verified", "processing"] },
      },
      options,
    );
  }

  /**
   * Get donation statistics
   */
  async getStatistics(filters = {}) {
    const matchStage = {};

    if (filters.campaignId) {
      matchStage.campaign = new mongoose.Types.ObjectId(filters.campaignId);
    }

    if (filters.donorId) {
      matchStage.donor = new mongoose.Types.ObjectId(filters.donorId);
    }

    if (filters.status) {
      matchStage.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      matchStage.createdAt = {};
      if (filters.startDate)
        matchStage.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate)
        matchStage.createdAt.$lte = new Date(filters.endDate);
    }

    return await this.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
            },
          },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ["$approvalStatus", "pending"] }, 1, 0],
            },
          },
        },
      },
    ]);
  }

  /**
   * Update donation status atomically
   */
  async updateStatus(id, status, additionalData = {}) {
    return await this.updateById(
      id,
      {
        status,
        ...additionalData,
        ...(status === "verified" && { verifiedAt: new Date() }),
        ...(status === "completed" && { completedAt: new Date() }),
      },
      { new: true },
    );
  }

  /**
   * Approve donation
   */
  async approve(id, approvedBy, approvedAt = new Date()) {
    return await this.updateById(
      id,
      {
        approvalStatus: "approved",
        approvedBy,
        approvedAt,
        status: "completed",
      },
      { new: true },
    );
  }

  /**
   * Reject donation
   */
  async reject(id, rejectedBy, rejectionReason, rejectedAt = new Date()) {
    return await this.updateById(
      id,
      {
        approvalStatus: "rejected",
        status: "rejected",
        rejectedBy,
        rejectedAt,
        rejectionReason,
      },
      { new: true },
    );
  }
}

export default new DonationRepository();
