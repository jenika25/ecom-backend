
const express = require('express');
const { getMe, updateMe, getAddresses, setDefaultAddress, deleteAddress, getAllUsers, toggleActive, deleteUser } = require('./user.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');
const { upload } = require('../../middlewares/upload.middleware');
const verifyImageType = require('../../middlewares/verifyImage');
const UserRouter = express.Router();

UserRouter.use(validattionMiddleware);

UserRouter.get("/me",userController.getOwnProfileController);

UserRouter.patch("/me",upload.single("profilePhoto"),userController.updateOwnProfileController);

UserRouter.get("/me/addresses",userController.getAllAddressesController);

UserRouter.post("/me/addresses",userController.createAddressController);

UserRouter.patch("/me/addresses/:addrId",userController.updateAddressController);

UserRouter.delete("/me/addresses/:addrId",userController.deleteAddressController);

UserRouter.patch("/:id/status",userController.updateUserStatusController);

UserRouter.delete("/:id",userController.deleteUserController);

UserRouter.get("/",userController.getAllusersController);

module.exports= UserRouter;
