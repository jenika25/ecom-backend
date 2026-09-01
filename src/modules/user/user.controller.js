const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");
const { OK, CREATED } = require("../../utils/httpStatus");
const UserService = require("./user.service");

const getOwnProfileController = asyncHandler(async (req, res) => {
  const result = await UserService.getOwnProfileService(req.user._id);
  res.status(OK).json(apiResponse(OK, result, "Profile fetched successfully"));
});

const updateOwnProfileController = asyncHandler(async (req, res) => {
  const result = await UserService.updateProfileService(req.user._id, req.body, req.file);
  res.status(OK).json(apiResponse(OK, result, "Profile updated successfully"));
});

const getAllAddressesController = asyncHandler(async (req, res) => {
  const result = await UserService.getAllAddressService(req.user._id);
  res.status(OK).json(apiResponse(OK, result, "Addresses fetched successfully"));
});

const createAddressController = asyncHandler(async (req, res) => {
  const result = await UserService.createAddressService(req.user._id, req.body);
  res.status(CREATED).json(apiResponse(CREATED, result, "Address created successfully"));
});

const updateAddressController = asyncHandler(async (req, res) => {
  const { addrId } = req.params;
  const result = await UserService.updateAddressService(req.user._id, addrId, req.body);
  res.status(OK).json(apiResponse(OK, result, "Address updated successfully"));
});

const deleteAddressController = asyncHandler(async (req, res) => {
  const { addrId } = req.params;
  const result = await UserService.deleteAddressService(req.user._id, addrId);
  res.status(OK).json(apiResponse(OK, result, "Address deleted successfully"));
});

const getAllusersController = asyncHandler(async (_req, res) => {
  const result = await UserService.getAllUsersService();
  res.status(OK).json(apiResponse(OK, result, "All users fetched successfully"));
});

const updateUserStatusController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateUserStatusService(id, req.body.isActive);
  res.status(OK).json(apiResponse(OK, result, "User status updated successfully"));
});

const deleteUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteUserService(id);
  res.status(OK).json(apiResponse(OK, result, "User deleted successfully"));
});

module.exports = {
  getOwnProfileController,
  updateOwnProfileController,
  getAllAddressesController,
  createAddressController,
  updateAddressController,
  deleteAddressController,
  getAllusersController,
  updateUserStatusController,
  deleteUserController,
};
