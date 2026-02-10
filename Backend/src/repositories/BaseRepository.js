/**
 * Base Repository Class
 * Provides common database operations for all repositories
 */
import mongoose from 'mongoose';

export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Find document by ID
   */
  async findById(id, options = {}) {
    const query = this.model.findById(id);
    
    if (options.populate) {
      query.populate(options.populate);
    }
    
    if (options.select) {
      query.select(options.select);
    }
    
    if (options.lean) {
      query.lean();
    }
    
    return await query;
  }

  /**
   * Find one document by query
   */
  async findOne(query, options = {}) {
    const dbQuery = this.model.findOne(query);
    
    if (options.populate) {
      dbQuery.populate(options.populate);
    }
    
    if (options.select) {
      dbQuery.select(options.select);
    }
    
    if (options.lean) {
      dbQuery.lean();
    }
    
    return await dbQuery;
  }

  /**
   * Find multiple documents
   */
  async find(query = {}, options = {}) {
    const dbQuery = this.model.find(query);
    
    if (options.populate) {
      dbQuery.populate(options.populate);
    }
    
    if (options.select) {
      dbQuery.select(options.select);
    }
    
    if (options.sort) {
      dbQuery.sort(options.sort);
    }
    
    if (options.skip) {
      dbQuery.skip(options.skip);
    }
    
    if (options.limit) {
      dbQuery.limit(options.limit);
    }
    
    if (options.lean) {
      dbQuery.lean();
    }
    
    return await dbQuery;
  }

  /**
   * Update document by ID
   */
  async updateById(id, data, options = {}) {
    const updateOptions = {
      new: options.new !== false, // Default to true
      runValidators: options.runValidators !== false
    };
    
    return await this.model.findByIdAndUpdate(id, data, updateOptions);
  }

  /**
   * Update one document by query
   */
  async updateOne(query, data, options = {}) {
    return await this.model.findOneAndUpdate(query, data, {
      new: options.new !== false,
      runValidators: options.runValidators !== false
    });
  }

  /**
   * Delete document by ID
   */
  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Count documents
   */
  async count(query = {}) {
    return await this.model.countDocuments(query);
  }

  /**
   * Aggregate pipeline
   */
  async aggregate(pipeline) {
    return await this.model.aggregate(pipeline);
  }

  /**
   * Execute operation within a transaction
   */
  async withTransaction(operation) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Atomic increment operation
   */
  async incrementField(id, field, amount = 1) {
    return await this.model.findByIdAndUpdate(
      id,
      { $inc: { [field]: amount } },
      { new: true }
    );
  }
}




