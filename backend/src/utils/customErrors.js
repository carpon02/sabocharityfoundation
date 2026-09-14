// ============================================
// FILE: utils/customErrors.js
// Custom Error Classes for Better Error Handling
// ============================================
import ApiError from './ApiError.js';
import logger from '../config/logger.js';

/**
 * Base class for all custom errors
 */
export class BaseError extends ApiError {
  constructor(message, statusCode, isOperational = true) {
    super(message, statusCode);
    this.isOperational = isOperational;
    this.name = this.constructor.name;
  }
}

/**
 * 400 Bad Request - Validation errors
 */
export class ValidationError extends BaseError {
  constructor(message = 'Validation failed', errors = {}) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * 401 Unauthorized - Authentication required
 */
export class UnauthorizedError extends BaseError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden - Insufficient permissions
 */
export class ForbiddenError extends BaseError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

/**
 * 404 Not Found - Resource not found
 */
export class NotFoundError extends BaseError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.resource = resource;
  }
}

/**
 * 409 Conflict - Resource conflict
 */
export class ConflictError extends BaseError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

/**
 * 422 Unprocessable Entity - Business logic errors
 */
export class UnprocessableEntityError extends BaseError {
  constructor(message = 'Unprocessable entity', errors = {}) {
    super(message, 422);
    this.errors = errors;
  }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class RateLimitError extends BaseError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429);
  }
}

/**
 * 500 Internal Server Error - Server errors
 */
export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

/**
 * Payment-related errors
 */
export class PaymentError extends BaseError {
  constructor(message = 'Payment processing failed', paymentDetails = {}) {
    super(message, 402);
    this.paymentDetails = paymentDetails;
  }
}

/**
 * Database operation errors
 */
export class DatabaseError extends BaseError {
  constructor(message = 'Database operation failed', operation = '') {
    super(message, 500);
    this.operation = operation;
  }
}

/**
 * File upload errors
 */
export class UploadError extends BaseError {
  constructor(message = 'File upload failed', fileDetails = {}) {
    super(message, 400);
    this.fileDetails = fileDetails;
  }
}

/**
 * Error handler utility
 */
export const handleError = (error, req, res, next) => {
  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    name: error.name,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // If error is operational (known error), send it to client
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.errors && { errors: error.errors }),
      ...(error.paymentDetails && { paymentDetails: error.paymentDetails }),
      ...(error.fileDetails && { fileDetails: error.fileDetails })
    });
  }

  // Programming or unknown errors - don't leak error details
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred. Please try again later.'
      : error.message
  });
};




