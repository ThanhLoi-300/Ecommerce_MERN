const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  percent: { type: Number },
  startDay: { type: Date, },
  endDay: { type: Date, },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', },
  productList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  status: { type: Boolean, default: false, },
});

module.exports = mongoose.model("Discount", discountSchema);
