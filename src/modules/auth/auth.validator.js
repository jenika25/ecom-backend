const apiError = require("../../utils/apiError");
const { BAD_REQUEST } = require("../../utils/httpStatus");

const validateRegister = (req, _res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw apiError(BAD_REQUEST, "Name is required");
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw apiError(BAD_REQUEST, "Valid email is required");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    throw apiError(BAD_REQUEST, "Password must be at least 6 characters long");
  }

  next();
};

const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    throw apiError(BAD_REQUEST, "Email is required");
  }

  if (!password || typeof password !== "string") {
    throw apiError(BAD_REQUEST, "Password is required");
  }

  next();
};

const validateChangePassword = (req, _res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw apiError(BAD_REQUEST, "Both oldPassword and newPassword are required");
  }

  if (typeof newPassword !== "string" || newPassword.length < 6) {
    throw apiError(BAD_REQUEST, "New password must be at least 6 characters long");
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
};