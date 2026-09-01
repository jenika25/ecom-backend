const express = require("express")
const BrandRouter = express.Router();
const BrandController = require("./brand.controller");
const { upload } = require("../../middlewares/upload.middleware");
const loadResource = require("../../middlewares/loadResource.middleware");
const BrandModel = require("../../models/brand.model");

BrandRouter.get("/",BrandController.getBrandsController);

BrandRouter.post("/",upload.single("logo"),BrandController.createBrandController);

BrandRouter.patch("/:id",loadResource(BrandModel),upload.single("logo"),BrandController.updateBrandController);

BrandRouter.delete("/:id",loadResource(BrandModel),BrandController.deleteBrandController);


module.exports = BrandRouter;