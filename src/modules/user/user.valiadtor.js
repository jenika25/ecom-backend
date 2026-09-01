const apiError = require("../../utils/apiError");
const { BAD_REQUEST } = require("../../utils/httpStatus");

const validateCreateAddress = (req, _res, next) => {
  const { fullName, phone, line1, city, state, pincode } = req.body;

  if (!fullName || !phone || !line1 || !city || !state || !pincode) {
    throw apiError(BAD_REQUEST, "fullName, phone, line1, city, state, and pincode are required");
  }

  next();
};

const validateUpdateProfile = (req, _res, next) => {
  const { name, phone } = req.body;

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    throw apiError(BAD_REQUEST, "Name cannot be empty");
  }

  next();
};

module.exports = {
  validateCreateAddress,
  validateUpdateProfile,
};