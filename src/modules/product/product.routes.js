const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("./product.controller");
const ProductModel = require("../../models/product.model");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const loadResource = require("../../middlewares/loadResource.middleware");
const { uploadMedia } = require("../../middlewares/upload.middleware");
const { validateCreateProduct, validateUpdateProduct } = require("./product.validator");

ProductRouter.get("/", ProductController.getProductsController);
ProductRouter.get("/:id", ProductController.getProductByIdController);

ProductRouter.post(
  "/",
  protect,
  authorize("seller", "admin"),
  uploadMedia.array("images", 5),
  validateCreateProduct,
  ProductController.createProductController
);

ProductRouter.patch(
  "/:id",
  protect,
  authorize("seller", "admin"),
  loadResource(ProductModel),
  uploadMedia.array("images", 5),
  validateUpdateProduct,
  ProductController.updateProductController
);

ProductRouter.delete(
  "/:id",
  protect,
  authorize("seller", "admin"),
  loadResource(ProductModel),
  ProductController.deleteProductController
);

module.exports = ProductRouter;