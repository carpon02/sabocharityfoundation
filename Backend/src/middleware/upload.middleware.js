import multer from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError.js';

// Configure multer storage (memory storage for Cloudinary)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  // Check mime type
  const mimetype = allowedMimes.includes(file.mimetype);
  
  // Check extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new ApiError('Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed', 400));
};

// Document file filter (for volunteer documents)
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  const mimetype = allowedMimes.includes(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new ApiError('Only PDF, DOC, DOCX, and image files are allowed', 400));
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

const documentUpload = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB for documents
  }
});

// Export different upload configurations
export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
export const uploadFields = (fields) => upload.fields(fields);
export const uploadDocument = (fieldName) => documentUpload.single(fieldName);
export const uploadDocuments = (fieldName, maxCount = 5) => documentUpload.array(fieldName, maxCount);

// Middleware to handle multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError('File size too large. Maximum size is 5MB', 400));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ApiError('Too many files. Maximum is 5 files', 400));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ApiError('Unexpected field in form data', 400));
    }
  }
  next(err);
};

export default upload;