import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import logger from "../config/logger.js";

// Handle CastError (invalid MongoDB ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

// Handle duplicate field error
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue ? err.keyValue[field] : "";
  const message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : "Field"} '${value}' already exists.`;
  return new ApiError(message, 400);
};

// Handle validation error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ApiError(message, 400);
};

// Handle JWT errors
const handleJWTError = () =>
  new ApiError("Invalid token. Please log in again.", 401);
const handleJWTExpiredError = () =>
  new ApiError("Your token has expired. Please log in again.", 401);

// Send error in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Send error in production
const sendErrorProd = (err, res) => {
  // Operational/trusted error: send safe message
  if (err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Unknown or programming error
  logger.error("💥 UNEXPECTED ERROR:", err);

  return ApiResponse.error(
    res,
    "Something went wrong on the server. Please try again later.",
    500
  );
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Create a copy so we don't mutate the original
  let error = { ...err };
  error.message = err.message;

  // Handle known Mongoose/JWT errors
  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// 404 Not Found Middleware
export const notFound = (req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
};

export default errorHandler;
