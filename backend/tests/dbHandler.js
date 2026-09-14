import { jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import * as emailService from "../src/services/emailService.js";

// Mock email service globally for all integration tests
jest.mock("../src/services/emailService.js", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

let mongod;

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
  // Prevent multiple connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  console.log("Starting MongoMemoryServer...");
  mongod = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 60000,
    },
  });
  const uri = mongod.getUri();
  console.log("Connecting to Mongoose at:", uri);

  // Mongoose 7+ default options are usually fine, but explicit is good
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  });
  console.log(
    "Mongoose connected successfully. State:",
    mongoose.connection.readyState,
  );
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
