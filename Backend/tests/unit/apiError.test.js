import ApiError from "../../src/utils/ApiError.js";

describe("ApiError Utility", () => {
  it("should create error with message and status code", () => {
    const error = new ApiError("Test error", 400);

    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });

  it("should default to 500 status code", () => {
    const error = new ApiError("Server error");

    expect(error.statusCode).toBe(500);
  });

  it("should be instance of Error", () => {
    const error = new ApiError("Test error", 400);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });

  it("should have stack trace", () => {
    const error = new ApiError("Test error", 400);

    expect(error.stack).toBeDefined();
  });
});
