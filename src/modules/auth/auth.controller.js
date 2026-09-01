const RefreshModel = require("../../models/refresh.model");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/apiResponse");
const ApiError = require("../../utils/apiError");
const User = require("../../models/user.model");
const { OK, NOT_FOUND } = require("../../utils/httpStatus");
const { signAccessToken, signRefreshToken } = require("../../utils/jwt");
const jwt = require('jsonwebtoken');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError(409, "User already exists");
  const user = await User.create({ name, email, password, role });
  const userJson = user.toObject();
  delete userJson.password;
  res.status(201).json(ApiResponse(201, userJson, "User registered successfully"));
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError(404, "User not found");

  const isMatch = await user.isPasswordCorrectPlain(password);
  if (!isMatch) throw ApiError(401, "Invalid credentials");

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  const userJson = user.toObject();
  delete userJson.password;
  res.status(200).json(ApiResponse(200, { accessToken, user: userJson }, "Login successful"));
});


exports.refresh = asyncHandler(async (req, res) => {
  let token = req.cookies.refreshToken;
  if (!token && req.headers['cookie']) {
      const match = req.headers['cookie'].match(/refreshToken=([^;]+)/);
      if (match) token = match[1];
  }
  if (!token) throw new ApiError(401, "No refresh token provided");

  const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'technorefresh');
  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(404, "User not found");

  const newAccessToken = signAccessToken(user);
  res.status(200).json(ApiResponse(200, { accessToken: newAccessToken }, "Token refreshed"));
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json(ApiResponse(200, null, "Logged out successfully"));
});

exports.context = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse(200, req.user, "Context hydrated"));
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.isPasswordCorrectPlain(oldPassword);
  if (!isMatch) throw new ApiError(401, "Invalid old password");
  user.password = newPassword;
  await user.save();
  res.status(200).json(ApiResponse(200, null, "Password changed successfully"));
});
