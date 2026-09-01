const UserModel = require("../../models/user.model");
const RefreshModel = require("../../models/refresh.model");
const apiError = require("../../utils/apiError");
const { NOT_FOUND, CONFLICT, UNAUTHORIZED } = require("../../utils/httpStatus");
const { hashPassword, verifyPassword } = require("../../utils/password");
const { signAccessToken, signRefreshToken } = require("../../utils/token");
const jwt = require("jsonwebtoken");

const registerService = async (data) => {
  const { name, email, password, role } = data;

  const isExist = await UserModel.findOne({ email });
  if (isExist) {
    throw apiError(CONFLICT, "User already exists");
  }

  const user = await UserModel.create({
    name,
    email,
    password,
    role,
  });

  const response = await UserModel.findById(user._id).select("-password");
  return { user: response };
};

const createRefreshService = async (data) => {
  const { userId, token } = data;

  await RefreshModel.deleteMany({
    user: userId,
  });

  const refreshData = await RefreshModel.create({
    user: userId,
    tokenHash: token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return refreshData;
};

const loginService = async (data) => {
  const { email, password } = data;
  const isUser = await UserModel.findOne({ email }).select("+password");
  if (!isUser) {
    throw apiError(NOT_FOUND, "User not found");
  }
  const compare = await isUser.isPasswordCorrectPlain(password);
  if (!compare) {
    throw apiError(UNAUTHORIZED, "Invalid credentials");
  }
  const response = await UserModel.findById(isUser._id).select("-password");
  return { user: response };
};

const logoutService = async (user) => {
  if (user && user._id) {
    await RefreshModel.deleteMany({
      user: user._id,
    });
  }
};

const refreshService = async (token) => {
  if (!token) throw apiError(UNAUTHORIZED, "No refresh token provided");
  const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "technorefresh");
  const user = await UserModel.findById(payload.sub);
  if (!user) throw apiError(NOT_FOUND, "User not found");

  const accessToken = signAccessToken(user);
  return { accessToken, user };
};

const changePasswordService = async (data) => {
  const { userId, newPassword, oldPassword } = data;
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw apiError(NOT_FOUND, "User not found");
  }
  const isMatch = await user.isPasswordCorrectPlain(oldPassword);

  if (!isMatch) {
    throw apiError(UNAUTHORIZED, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();
  return true;
};

const getUserDataById = async (id) => {
  const user = await UserModel.findById(id);
  return user;
};

module.exports = {
  refreshService,
  registerService,
  loginService,
  logoutService,
  changePasswordService,
  createRefreshService,
  getUserDataById,
};
