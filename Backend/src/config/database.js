import mongoose from 'mongoose';
import dns from 'dns';
import logger from './logger.js';

const connectDB = async () => {
  try {
    // Use Google DNS to resolve SRV records (fixes Starlink DNS issues)
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    // Connection pool configuration for production-ready setup
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/saboFoundation`, {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10, // Maximum connections
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE) || 5,  // Minimum connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
      retryWrites: true, // Retry failed writes
      w: 'majority' // Write concern: require majority of servers to acknowledge
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;