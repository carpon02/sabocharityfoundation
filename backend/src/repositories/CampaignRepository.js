/**
 * Campaign Repository
 * Data access layer for Campaign model
 */
import { BaseRepository } from './BaseRepository.js';
import Campaign from '../models/Campaign.js';

class CampaignRepository extends BaseRepository {
  constructor() {
    super(Campaign);
  }

  /**
   * Find campaign by slug
   */
  async findBySlug(slug, options = {}) {
    return await this.findOne({ slug }, options);
  }

  /**
   * Find active campaigns
   */
  async findActive(options = {}) {
    return await this.find(
      { status: 'active', isActive: true },
      options
    );
  }

  /**
   * Find campaigns by status
   */
  async findByStatus(status, options = {}) {
    return await this.find({ status }, options);
  }

  /**
   * Find campaigns by creator
   */
  async findByCreator(creatorId, options = {}) {
    return await this.find({ createdBy: creatorId }, options);
  }

  /**
   * Find featured campaigns
   */
  async findFeatured(options = {}) {
    return await this.find({ featured: true, status: 'active' }, options);
  }

  /**
   * Atomically increment raised amount
   * CRITICAL: Prevents race conditions
   */
  async incrementRaisedAmount(campaignId, amount) {
    return await this.incrementField(campaignId, 'raisedAmount', amount);
  }

  /**
   * Atomically increment donor count
   */
  async incrementDonorCount(campaignId) {
    return await this.incrementField(campaignId, 'donorCount', 1);
  }

  /**
   * Update campaign statistics atomically
   * Uses aggregation to calculate accurate stats
   */
  async updateDonationStats(campaignId) {
    const Donation = (await import('../models/Donation.js')).default;
    
    const stats = await Donation.aggregate([
      { 
        $match: { 
          campaign: campaignId, 
          status: 'completed' 
        } 
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          donorCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      return await this.updateById(
        campaignId,
        {
          raisedAmount: stats[0].totalAmount,
          donorCount: stats[0].donorCount
        }
      );
    }

    return await this.findById(campaignId);
  }

  /**
   * Get campaign statistics
   */
  async getStatistics(filters = {}) {
    const matchStage = {};
    
    if (filters.status) {
      matchStage.status = filters.status;
    }
    
    if (filters.category) {
      matchStage.category = filters.category;
    }

    return await this.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCampaigns: { $sum: 1 },
          totalTarget: { $sum: '$targetAmount' },
          totalRaised: { $sum: '$raisedAmount' },
          averageProgress: { $avg: { $divide: ['$raisedAmount', '$targetAmount'] } }
        }
      }
    ]);
  }
}

export default new CampaignRepository();


