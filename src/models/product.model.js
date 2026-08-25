const { nanoid } = require('nanoid');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, maxlength: 4000 },
  price: { type: Number, required: true, min: 1 },
  mrp: { type: Number, required: true, min: 1 },
  images: [{ url: String, publicId: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', index: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stockQty: { type: Number, required: true, min: 0, default: 0 },
  tags: [{ type: String, enum: ['trending','top-selling','new'] }],
  rating: { type: Number, default: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

productSchema.virtual('discountPercent').get(function() {
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.virtual('usedStock').get(function() {
  return this.stockQty - this.orderCount;
});

productSchema.pre('validate', function(next) {
  this.slug = slugify(this.title) + '-' + nanoid(6);
  if (this.price > this.mrp) {
    return next(new Error('Price cannot exceed MRP'));
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
