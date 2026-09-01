const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require("dotenv").config();

const AuthRouter = require("./modules/auth/auth.routes");
const UserRouter = require("./modules/user/user.routes");
const BrandRouter = require("./modules/brand/brand.routes");
const CategoryRouter = require("./modules/category/category.routes");
const ProductRouter = require("./modules/product/product.routes");

const apiResponse = require('./utils/apiResponse');
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/categories', CategoryRouter);
app.use('/api/v1/brands', BrandRouter);
app.use('/api/v1/products', ProductRouter);

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