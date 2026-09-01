const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const AuthRouter = require("./modules/auth/auth.routes");
const UserRouter = require("./modules/user/user.routes");
require("dotenv").config();
const apiResponse = require('./utils/apiResponse');
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");
const asyncHandler = require("./utils/asyncHandler");
const BrandRouter = require("./modules/brand/brand.routes");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));

app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/users', require('./modules/user/user.routes'));
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/brands", BrandRouter);
app.use("/api/v1/products", ProductRouter);
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json(apiResponse(200, {
    service: 'ecom-backend',
    env: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  }, 'API is running'));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;