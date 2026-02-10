import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import fs from 'fs'; // For path handling
import path from 'path'; // For path resolution

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary (handles both buffer and path)
export const uploadToCloudinary = (file, folder = 'general') => {
  return new Promise((resolve, reject) => {
    let uploadStream;

    try {
      // Validate file
      if (!file) {
        return reject(new Error('No file provided'));
      }

      const isBuffer = Buffer.isBuffer(file.buffer) || (file.buffer && typeof file.buffer === 'object');
      const isPath = typeof file.path === 'string' && fs.existsSync(file.path);

      if (!isBuffer && !isPath) {
        return reject(new Error('Invalid file: Must provide buffer or path'));
      }

      uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `sabo-ibadan/${folder}`,
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          resource_type: 'auto'
        },
        (error, result) => {
          // Clean up temp file if path was used
          if (isPath && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }

          if (error) {
            console.error('Cloudinary upload error:', error); // Enhanced logging
            reject(error);
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes
            });
          }
        }
      );

      // Pipe stream based on input type
      if (isBuffer) {
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else if (isPath) {
        const readStream = fs.createReadStream(file.path);
        readStream.on('error', reject);
        readStream.pipe(uploadStream);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Upload multiple images
export const uploadMultipleToCloudinary = async (files, folder = 'general') => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
  return await Promise.all(uploadPromises);
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error('Public ID is required for deletion');
    }
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error('Failed to delete resource');
    }
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete image from cloud storage');
  }
};

// Delete multiple images
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      throw new Error('Public IDs array is required for batch deletion');
    }
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Cloudinary batch deletion error:', error);
    throw new Error('Failed to delete images from cloud storage');
  }
};

// Upload document (PDF, DOC, etc.)
export const uploadDocument = (file, folder = 'documents') => {
  return new Promise((resolve, reject) => {
    let uploadStream;

    try {
      if (!file) {
        return reject(new Error('No file provided'));
      }

      const isBuffer = Buffer.isBuffer(file.buffer) || (file.buffer && typeof file.buffer === 'object');
      const isPath = typeof file.path === 'string' && fs.existsSync(file.path);

      if (!isBuffer && !isPath) {
        return reject(new Error('Invalid file: Must provide buffer or path'));
      }

      uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `sabo-ibadan/${folder}`,
          resource_type: 'raw'
        },
        (error, result) => {
          // Clean up temp file if path was used
          if (isPath && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }

          if (error) {
            reject(error);
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              bytes: result.bytes
            });
          }
        }
      );

      if (isBuffer) {
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else if (isPath) {
        const readStream = fs.createReadStream(file.path);
        readStream.on('error', reject);
        readStream.pipe(uploadStream);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Get image details
export const getImageDetails = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error('Public ID is required');
    }
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary get image error:', error);
    throw new Error('Failed to fetch image details');
  }
};

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  uploadDocument,
  getImageDetails
};