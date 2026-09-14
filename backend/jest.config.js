export default {
  testEnvironment: "node",
  transform: {}, // Disable transform to use native ES modules
  verbose: true,
  testTimeout: 60000,
  roots: ["<rootDir>/tests"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
