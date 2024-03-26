const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String, },
  category: { type: String, },
  start_Date: { type: Date, required: true },
  Finish_Date: { type: Date, required: true },
  status: { type: String, default: "Running", },
  tags: { type: String, },
  originalPrice: { type: Number, },
  discountPrice: { type: Number, },
  stock: { type: Number, },
  images: [
    {
      public_id: { type: String, required: true, },
      url: { type: String, required: true, },
    },
  ],
  shopId: { type: String, required: true, },
  shop: { type: Object, required: true, },
  sold_out: { type: Number, default: 0, },
  createdAt: { type: Date, default: Date.now(), },
});

module.exports = mongoose.model("Event", eventSchema);
