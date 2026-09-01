const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { OK, CREATED } = require("../../utils/httpStatus");
const ProductService = require("./product.service");

const getProductsController = asyncHandler(async (req, res) => {
  const result = await ProductService.getAllProductsService(req.query);
  res.status(OK).json(apiResponse(OK, result, "Products fetched successfully"));
});

const getProductByIdController = asyncHandler(async (req, res) => {
  const result = await ProductService.getProductByIdService(req.params.id);
  res.status(OK).json(apiResponse(OK, result, "Product details fetched successfully"));
});

const createProductController = asyncHandler(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  const sellerId = req.user._id;
  const result = await ProductService.createProductService(req.body, files, sellerId);
  res.status(CREATED).json(apiResponse(CREATED, result, "Product created successfully"));
});

const updateProductController = asyncHandler(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  const productResource = req.resource;
  const result = await ProductService.updateProductService(productResource, req.body, files);
  res.status(OK).json(apiResponse(OK, result, "Product updated successfully"));
});

const deleteProductController = asyncHandler(async (req, res) => {
  const productResource = req.resource;
  const result = await ProductService.deleteProductService(productResource);
  res.status(OK).json(apiResponse(OK, result, "Product deleted successfully"));
});

module.exports = {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
};
