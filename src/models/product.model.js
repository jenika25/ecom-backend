const mongoose = require("mongoose");
const { convertToSlug, nanoId } = require("../utils/slug");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, maxlength: 4000 },
  price: { type: Number, required: true, min: 1 },
  mrp: { type: Number, required: true, min: 1 },
  images: [{ url: String, publicId: String }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    index: true,
  },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", index: true },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  stockQty: { type: Number, required: true, min: 0, default: 0 },
  tags: [{ type: String, enum: ["trending", "top-selling", "new"] }],
  rating: { type: Number, default: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

productSchema.virtual("discountPercent").get(function () {
  if (!this.mrp || this.mrp <= 0) return 0;

  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.virtual("inStock").get(function () {
  return this.stockQty > 0;
});

productSchema.set("toJSON", {
  virtuals: true,
});

productSchema.set("toObject", {
  virtuals: true,
});
productSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = `${convertToSlug(this.title)}-${nanoId()}`;
  }

  next();
});

productSchema.pre("validate", function (next) {
  if (this.price > this.mrp) {
    this.invalidate("price", "Price cannot exceed MRP");
  }
  next();
});

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = ProductModel;

