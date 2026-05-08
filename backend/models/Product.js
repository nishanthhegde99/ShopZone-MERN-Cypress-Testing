const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Automotive'],
    },
    brand: { type: String, default: '' },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        rating: { type: Number, required: true },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
