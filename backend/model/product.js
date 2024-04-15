const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, },
  description: { type: String, },
  category: { type: String, },
  tags: { type: String, },
  originalPrice: { type: Number, },
  discount: { type: mongoose.Schema.Types.ObjectId, ref: "Discount", default: null},
  stock: { type: Number, },
  images: { type: Array, },
  video: { type: String},
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, },
      comment: { type: String, },
      productId: { type: String, },
      createdAt:{ type: Date, default: Date.now(), }
    },
  ],
  ratings: { type: Number, },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', },
  sold_out: { type: Number, default: 0, },
  createdAt: { type: Date, default: Date.now(), },
});

module.exports = mongoose.model("Product", productSchema);