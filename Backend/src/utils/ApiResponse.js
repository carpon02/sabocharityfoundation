// API Response Class for consistent responses
class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data) this.data = data;
  }

  static success(res, message, data = null, statusCode = 200) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, message, data));
  }

  static error(res, message, statusCode = 500) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message));
  }

  static created(res, message, data = null) {
    return res.status(201).json(new ApiResponse(201, message, data));
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

export default ApiResponse;
