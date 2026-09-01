const ProductModel = require("../../models/product.model");
const apiError = require("../../utils/apiError");
const { NOT_FOUND, BAD_REQUEST } = require("../../utils/httpStatus");
const { convertToSlug, nanoId } = require("../../utils/slug");
const { uploadToCloudinary, destroyFromCloudinary } = require("../../utils/uploadToCloudinary");

const getAllProductsService = async (query = {}) => {
  const { page = 1, limit = 10, category, brand, search, minPrice, maxPrice, sort = "-createdAt" } = query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (search) filter.title = { $regex: search, $options: "i" };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const products = await ProductModel.find(filter)
    .populate("category", "name slug")
    .populate("brand", "name logo")
    .populate("seller", "name email")
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await ProductModel.countDocuments(filter);

  return {
    products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

const getProductByIdService = async (idOrSlug) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

  const product = await ProductModel.findOne(filter)
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("brand", "name logo")
    .populate("seller", "name email");

  if (!product) {
    throw apiError(NOT_FOUND, "Product not found");
  }

  return product;
};

const createProductService = async (payload, files, sellerId) => {
  payload.seller = sellerId;

  if (payload.title) {
    payload.slug = `${convertToSlug(payload.title)}-${nanoId()}`;
  }

  if (files && files.length > 0) {
    const uploadedImages = [];
    for (const file of files) {
      const img = await uploadToCloudinary(file.buffer, "ecom/products");
      uploadedImages.push(img);
    }
    payload.images = uploadedImages;
  }

  const product = await ProductModel.create(payload);
  return product;
};

const updateProductService = async (product, payload, files) => {
  if (payload.title && payload.title !== product.title) {
    product.title = payload.title;
    product.slug = `${convertToSlug(payload.title)}-${nanoId()}`;
  }

  if (payload.description !== undefined) product.description = payload.description;
  if (payload.price !== undefined) product.price = payload.price;
  if (payload.mrp !== undefined) product.mrp = payload.mrp;
  if (payload.category !== undefined) product.category = payload.category;
  if (payload.subcategory !== undefined) product.subcategory = payload.subcategory;
  if (payload.brand !== undefined) product.brand = payload.brand;
  if (payload.stockQty !== undefined) product.stockQty = payload.stockQty;
  if (payload.isActive !== undefined) product.isActive = payload.isActive;
  if (payload.tags !== undefined) product.tags = payload.tags;

  if (files && files.length > 0) {
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.publicId) await destroyFromCloudinary(img.publicId);
      }
    }
    const uploadedImages = [];
    for (const file of files) {
      const img = await uploadToCloudinary(file.buffer, "ecom/products");
      uploadedImages.push(img);
    }
    product.images = uploadedImages;
  }

  await product.save();
  return product;
};

const deleteProductService = async (product) => {
  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      if (img.publicId) await destroyFromCloudinary(img.publicId);
    }
  }
  await product.deleteOne();
  return product;
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
