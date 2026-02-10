import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    css: true,
    forks: {
      execArgv: ["--experimental-vm-modules"],
      singleFork: true,
    },
    testTimeout: 60000,
    hookTimeout: 60000,
    teardownTimeout: 60000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "**/*.config.js", "**/dist/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
