const express = require("express");
const UserRouter = express.Router();
const userController = require("./user.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const { upload } = require("../../middlewares/upload.middleware");
const { validateCreateAddress, validateUpdateProfile } = require("./user.validator");

UserRouter.get("/me", protect, userController.getOwnProfileController);

UserRouter.patch(
  "/me",
  protect,
  upload.single("profilePhoto"),
  validateUpdateProfile,
  userController.updateOwnProfileController
);

UserRouter.get("/me/addresses", protect, userController.getAllAddressesController);

UserRouter.post(
  "/me/addresses",
  protect,
  validateCreateAddress,
  userController.createAddressController
);

UserRouter.patch("/me/addresses/:addrId", protect, userController.updateAddressController);

UserRouter.delete("/me/addresses/:addrId", protect, userController.deleteAddressController);

UserRouter.get("/", protect, authorize("admin"), userController.getAllusersController);

UserRouter.patch("/:id/status", protect, authorize("admin"), userController.updateUserStatusController);

UserRouter.delete("/:id", protect, authorize("admin"), userController.deleteUserController);

module.exports = UserRouter;
