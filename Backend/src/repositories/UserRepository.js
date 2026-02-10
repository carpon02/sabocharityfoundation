/**
 * User Repository
 * Data access layer for User model
 */
import { BaseRepository } from './BaseRepository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   */
  async findByEmail(email, options = {}) {
    const select = options.includePassword 
      ? '+password' 
      : options.select || '-password';
    
    return await this.findOne({ email: email.toLowerCase() }, { ...options, select });
  }

  /**
   * Find user by email verification token
   */
  async findByVerificationToken(token) {
    return await this.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
  }

  /**
   * Find user by password reset token
   */
  async findByResetToken(token) {
    return await this.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    }, { includePassword: true });
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId) {
    return await this.updateById(
      userId,
      {
        isEmailVerified: true,
        emailVerificationToken: undefined,
        emailVerificationExpires: undefined
      }
    );
  }

  /**
   * Update password
   */
  async updatePassword(userId, hashedPassword) {
    return await this.updateById(
      userId,
      {
        password: hashedPassword,
        lastPasswordChange: new Date()
      }
    );
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId) {
    return await this.updateById(
      userId,
      { lastLogin: new Date() },
      { new: false } // Don't return updated doc for performance
    );
  }
}

export default new UserRepository();




