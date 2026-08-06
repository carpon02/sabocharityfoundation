import User from "../../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../services/emailService.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../services/uploadService.js";
import logger from "../../config/logger.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  async register({ fullName, email, phone, password, role }) {
    if (!fullName || !email || !password) {
      throw new Error("Please provide all required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    let userRole = "donor";
    let userEmailVerified = false;
    if (role === "admin" && process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
      userRole = "admin";
      userEmailVerified = true;
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: userRole,
      isActive: true,
      isEmailVerified: userEmailVerified,
    });

    if (userRole !== "admin") {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      user.emailVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const verificationUrl = `${clientUrl}/verify/${verificationToken}`;

      try {
        await sendEmail({
          to: user.email,
          subject: "Verify Your Email",
          template: "emailVerification",
          data: { name: user.fullName, verificationUrl },
        });
      } catch (error) {
        logger.error("Email sending error during registration:", {
          error: error.message,
          userId: user._id,
        });
        await User.deleteOne({ _id: user._id });
        throw new Error("Failed to send verification email. Please try again later.");
      }
    }

    return { user, message: userRole === "admin" ? "Admin registration successful." : "Registration successful. Please check your email to verify your account." };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Your account has been deactivated");
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    return user;
  }

  async updateDetails(userId, data, file) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (data.fullName) user.fullName = data.fullName;
    if (data.phone) user.phone = data.phone;
    if (data.bio) user.bio = data.bio;
    if (data.location && typeof data.location === "object") {
      user.location = { ...user.location, ...data.location };
    }

    if (file) {
      if (user.avatarPublicId) {
        await deleteFromCloudinary(user.avatarPublicId);
      }
      const uploadResult = await uploadToCloudinary(file, "avatars");
      user.avatar = uploadResult.secure_url || uploadResult.url;
      user.avatarPublicId = uploadResult.public_id || uploadResult.publicId;
    }

    return await user.save();
  }

  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error("Please provide current and new password");
    }
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }

    const user = await User.findById(userId).select("+password");
    if (!(await user.comparePassword(currentPassword))) {
      throw new Error("Current password is incorrect");
    }

    // Since matchPassword was updated to use bcrypt directly in user model
    user.password = newPassword; 
    await user.save();

    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("No user found with that email");

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        template: "passwordReset",
        data: { name: user.fullName, resetUrl },
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new Error("Email could not be sent. Please try again");
    }
  }

  async resetPassword(resetToken, newPassword) {
    const resetPasswordTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetPasswordTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Invalid or expired token");
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return user;
  }

  async verifyEmail(token) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Invalid or expired verification token");

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return user;
  }

  async resendVerification(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.isEmailVerified) throw new Error("Email is already verified");

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verificationUrl = `${clientUrl}/verify/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      template: "emailVerification",
      data: { name: user.fullName, verificationUrl },
    });
  }

  async googleLogin(credential) {
    if (!credential) throw new Error("Google credential is required");

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub, email, name, picture, email_verified } = ticket.getPayload();

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = sub;
        if (!user.avatar) user.avatar = picture;
        user.authMethod = "google";
        if (email_verified) user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
      } else {
        user = await User.create({
          fullName: name,
          email,
          googleId: sub,
          avatar: picture,
          authMethod: "google",
          isEmailVerified: email_verified || false,
          role: "donor",
          isActive: true,
        });
      }
    }

    if (!user.isActive) throw new Error("Your account has been deactivated");

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    return user;
  }
}

export default new AuthService();
