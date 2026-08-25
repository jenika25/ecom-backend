const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, index: true },
  logo: { url: String, publicId: String },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Brand', brandSchema);
