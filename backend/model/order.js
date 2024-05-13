const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cart: { type: Array },
  shippingAddress: { type: Object, },
  user: { type: Object, },
  totalPrice: { type: Number, },
  discountPrice: { type: Number, },
  status: { type: String, default: "Processing", },
  paymentInfo: {
    id: { type: String, },
    status: { type: String, },
    type: { type: String, },
  },
  paidAt: { type: Date, default: Date.now(), },
  deliveredAt: { type: Date, },
  createdAt: { type: Date, default: Date.now(), },
});

module.exports = mongoose.model("Order", orderSchema);
