import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Protect routes - verify JWT token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const isAdminApp = req.headers['x-app-type'] === 'admin';

  // 1️⃣ Check Authorization header first, then the app-specific cookie.
  // Admin dashboard sends X-App-Type: admin → read 'admin_token'.
  // Public frontend (no header) → read 'token'.
  // This prevents cookie collision when both apps run on localhost.
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (isAdminApp && req.cookies?.admin_token) {
    token = req.cookies.admin_token;
  } else if (!isAdminApp && req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2️⃣ If no token
  if (!token) {
    return next(new ApiError('Not authorized to access this route', 401));
  }

  try {
    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Find user (FIXED: use decoded.id instead of decoded._id)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new ApiError('User not found or deleted', 401));
    }

    // 5️⃣ Check if account is active
    if (user.isActive === false) {
      return next(new ApiError('Your account has been deactivated', 401));
    }

    // 6️⃣ Check if password changed after token was issued (optional - only if method exists)
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return next(new ApiError('Password recently changed. Please log in again', 401));
    }

    // ✅ Grant access (FIXED: attach the full user object with _id)
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return next(new ApiError('Invalid or expired token', 401));
  }
});

/**
 * @desc Restrict access to specific roles
 * @usage authorize('admin', 'super_admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('User not authenticated', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * @desc Optional authentication (does not throw if no token)
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (user && user.isActive !== false) {
        req.user = user;
      }
    } catch (err) {
      // Silent fail - no interruption if token invalid
      console.log('Optional auth failed silently:', err.message);
    }
  }

  next();
});

/**
 * @desc Require verified user (email verification check)
 */
export const requireVerification = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError('User not authenticated', 401));
  }
  
  if (!req.user.isEmailVerified) {
    return next(
      new ApiError('Please verify your email to access this resource', 403)
    );
  }
  next();
};

/**
 * @desc Check if user owns the resource or is admin/super_admin
 */
export const checkOwnership = (modelName) => {
  return asyncHandler(async (req, res, next) => {
    const Model = mongoose.model(modelName);
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new ApiError(`${modelName} not found`, 404));
    }

    // Allow access if owner or admin/super_admin
    const userId = req.user._id.toString();
    const docUserId = doc.user?.toString() || doc.createdBy?.toString();
    
    if (
      docUserId !== userId &&
      !['admin'].includes(req.user.role)
    ) {
      return next(
        new ApiError('You do not have permission to access this resource', 403)
      );
    }

    req.resource = doc;
    next();
  });
};

/**
 * @desc Restrict to specific roles (alias for authorize)
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('User not authenticated', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * @desc Restrict access to specific admin roles (super_admin has universal access)
 * @usage authorizeAdminRole('finance_admin', 'content_editor')
 */
export const authorizeAdminRole = (...adminRoles) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return next(new ApiError('Not authorized as an admin', 403));
    }
    
    // Bypass for super_admin
    if (req.user.adminRole === 'super_admin') {
      return next();
    }

    if (!adminRoles.includes(req.user.adminRole)) {
      return next(
        new ApiError(`Access denied. Requires one of the following admin roles: ${adminRoles.join(', ')}`, 403)
      );
    }
    next();
  };
};