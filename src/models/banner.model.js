const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { url: { type: String, required: true }, publicId: String },
  link: { type: String, default: '/' },
  placement: { 
    type: String, 
    enum: ['home-hero','home-strip','plp','cart','orders'], 
    required: true, 
    index: true 
  },
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startAt: { type: Date },
  endAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
