class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

function createApiError(statusCode, message, errors = [], stack = "") {
  return new ApiError(statusCode, message, errors, stack);
}

Object.setPrototypeOf(createApiError, ApiError);
createApiError.prototype = ApiError.prototype;

module.exports = createApiError;

