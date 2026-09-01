const UserModel = require("../models/user.model");
const { getUserDataById } = require("../modules/auth/auth.service");
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiError = require('../utils/apiError');
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require('../utils/asyncHandler');
const { verifyAccessToken } = require("../utils/token");

const { hasPermission } = require("../constants/permissions");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  
  if (!token) throw new ApiError(401, "Not authorized to access this route");

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'technoaccess');
    req.user = await User.findById(decoded.sub);
    if (!req.user) throw new ApiError(404, "User no longer exists");
    next();
  } catch (err) {
    throw new ApiError(401, "Not authorized to access this route");
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "User role is not authorized to access this route"));
    }
    next();
  };
};
