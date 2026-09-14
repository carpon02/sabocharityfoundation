// src/config/cloudinary.js

import dotenv from 'dotenv';
dotenv.config(); // must be at the very top

import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import logger from './logger.js';

// Validate Cloudinary environment variables
const requiredCloudinaryEnv = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

requiredCloudinaryEnv.forEach((key) => {
  if (!process.env[key]) {
    logger.error(`❌ Missing Cloudinary environment variable: ${key}`);
    throw new Error(`Missing Cloudinary environment variable: ${key}`);
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------
// Upload a single file to Cloudinary
// --------------------
export const uploadToCloudinary = (file, folder = 'general') => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error('No file buffer provided for upload'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `sabo-ibadan/${folder}`,
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// --------------------
// Delete image by publicId
// --------------------
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error('No publicId provided for deletion');

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Cloudinary deletion error:', error);
    throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
  }
};

// --------------------
// Export default Cloudinary instance
// --------------------
export default cloudinary;
