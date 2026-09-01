const apiError = require("../../utils/apiError");
const { BAD_REQUEST } = require("../../utils/httpStatus");

const validateCreateProduct = (req, _res, next) => {
  const { title, price, mrp, category } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    throw apiError(BAD_REQUEST, "Product title is required");
  }

  if (!price || isNaN(Number(price)) || Number(price) <= 0) {
    throw apiError(BAD_REQUEST, "Valid product price is required");
  }

  if (!mrp || isNaN(Number(mrp)) || Number(mrp) <= 0) {
    throw apiError(BAD_REQUEST, "Valid product MRP is required");
  }

  if (Number(price) > Number(mrp)) {
    throw apiError(BAD_REQUEST, "Price cannot exceed MRP");
  }

  if (!category) {
    throw apiError(BAD_REQUEST, "Product category is required");
  }

  next();
};

const validateUpdateProduct = (req, _res, next) => {
  const { price, mrp } = req.body;

  if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
    throw apiError(BAD_REQUEST, "Valid product price is required");
  }

  if (mrp !== undefined && (isNaN(Number(mrp)) || Number(mrp) <= 0)) {
    throw apiError(BAD_REQUEST, "Valid product MRP is required");
  }

  if (price !== undefined && mrp !== undefined && Number(price) > Number(mrp)) {
    throw apiError(BAD_REQUEST, "Price cannot exceed MRP");
  }

  next();
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
};
