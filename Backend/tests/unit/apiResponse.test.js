import ApiResponse from "../../src/utils/ApiResponse.js";
import { jest } from "@jest/globals";

describe("ApiResponse Utility", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("success", () => {
    it("should send success response with data", () => {
      const data = { id: 1, name: "Test" };
      ApiResponse.success(mockRes, "Success message", data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 200,
          message: "Success message",
          data,
        }),
      );
    });

    it("should use custom status code", () => {
      ApiResponse.success(mockRes, "Success", {}, 201);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("created", () => {
    it("should send 201 created response", () => {
      const data = { id: 1 };
      ApiResponse.created(mockRes, "Resource created", data);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 201,
          message: "Resource created",
          data,
        }),
      );
    });
  });

  describe("error", () => {
    it("should send error response", () => {
      ApiResponse.error(mockRes, "Error occurred", 400);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 400,
          message: "Error occurred",
        }),
      );
    });

    it("should default to 500 status code", () => {
      ApiResponse.error(mockRes, "Server error");

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 500,
          message: "Server error",
        }),
      );
    });
  });
});
