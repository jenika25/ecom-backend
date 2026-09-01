const apiError = require("../../utils/apiError");
const { BAD_REQUEST } = require("../../utils/httpStatus");

const validateCreateCategory = (req, _res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    throw apiError(BAD_REQUEST, "Category name is required");
  }
  next();
};

const validateUpdateCategory = (req, _res, next) => {
  const { name } = req.body;
  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    throw apiError(BAD_REQUEST, "Category name cannot be empty");
  }
  next();
};

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
};
