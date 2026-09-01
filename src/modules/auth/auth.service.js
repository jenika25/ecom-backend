const express = require("express");
const { UserModel, RefreshTokenModel } = require("../../models/index1");
const apiError = require("../../utils/apiError");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signAccessToken, signRefreshToken } = require("../../utils/token");

const registerService = async (data) => {
  const { name, email, password, role } = data;

  const isExist = await UserModel.findOne({ email });
  if (isExist) {
    throw apiError(409, "user already exist");
  }
  const hashedPassword = await hashPassword(password);
  const userData = {
    name,
    email,
    password: hashedPassword,
    role: role,
  };

  const user = await UserModel.create(userData);

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
    token: token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return refreshData;
};

const loginService = async (data) => {
  const { email, password } = data;
  const isUser = await UserModel.findOne({ email });
  if (!isUser) {
    throw apiError(409, "user already exist");
  }
  const compare = await comparePassword(password, isUser.password);
  if (!compare) {
    throw apiError(401, "user already exist");
  }
  const response = await UserModel.findById(isUser._id).select("-password");
  return { user: response };
};

const logoutService = async (user) => {
  await RefreshModel.deleteMany({
    user: user.userID,
  });
};

const refreshService = async () => {

};

const changePasswordService = async (data) => {
  const { userId, newPassword, oldPassword } = data;
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw apiError(NOT_FOUND, "user not found");
  }
  const decode = verifyPassword(oldPassword, user.password);

  if (!decode) {
    throw apiError(NOT_FOUND, "Invalid password");
  }
  const hashNewPassword = await hashPassword(newPassword);

  user.password = hashNewPassword;
  await user.save();
};

const getUserDataById = async (data) => {
  const user = await UserModel.findById(data);
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
