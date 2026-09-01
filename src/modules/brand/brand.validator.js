const apiError = require("../../utils/apiError");
const { BAD_REQUEST } = require("../../utils/httpStatus");

const validateCreateBrand = (req, _res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    throw apiError(BAD_REQUEST, "Brand name is required");
  }
  next();
};

const validateUpdateBrand = (req, _res, next) => {
  const { name } = req.body;
  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    throw apiError(BAD_REQUEST, "Brand name cannot be empty");
  }
  next();
};

module.exports = {
  validateCreateBrand,
  validateUpdateBrand,
};
