const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  orderItemId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reason: { type: String, required: true, minlength: 10, maxlength: 500 },
  photo: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['requested','approved','rejected','picked','refunded'], 
    default: 'requested', 
    index: true 
  },
  placedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index: one return request per item
returnSchema.index({ order: 1, orderItemId: 1 }, { unique: true });

module.exports = mongoose.model('Return', returnSchema);
