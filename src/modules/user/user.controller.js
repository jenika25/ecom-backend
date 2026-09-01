const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/apiResponse");
const ApiError = require("../../utils/apiError");
const User = require("../../models/user.model");
const { OK, UNAUTHORIZED } = require("../../utils/httpStatus");
const userServices = require("./user.service");

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(ApiResponse(200, user, "Own profile"));
});

// PATCH /users/me
exports.updateMe = asyncHandler(async (req, res) => {
  const updates = { name: req.body.name, phone: req.body.phone, avatar: req.body.avatar };
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.status(200).json(ApiResponse(200, user, "Profile updated"));
});

// GET /users/me/addresses
exports.getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("address");
  res.status(200).json(ApiResponse(200, user.address, "Addresses list"));
});

// PATCH /users/me/addresses/default
exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.address.forEach(addr => addr.isDefault = false);
  const addr = user.address.id(req.body.id);
  if (!addr) throw new ApiError(404, "Address not found");
  addr.isDefault = true;
  await user.save();
  res.status(200).json(ApiResponse(200, user.address, "Default address set"));
});

// DELETE /users/me/addresses/:id
exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.address.id(req.params.id).remove();
  await user.save();
  res.status(200).json(ApiResponse(200, null, "Address deleted"));
});

// GET /users (admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(ApiResponse(200, users, "All users fetched"));
});

// PATCH /users/:id (admin block/unblock)
exports.toggleActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json(ApiResponse(200, user, "User status updated"));
});

// DELETE /users/:id (admin delete)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(ApiResponse(200, null, "User deleted"));
});
