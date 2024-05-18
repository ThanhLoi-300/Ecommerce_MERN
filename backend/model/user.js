const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phoneNumber: { type: Number },
  fromGoogle: { type: Boolean, default: false },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number},
    },
  ],
  addresses: [
    {
      city: { type: String },
      district: { type: String },
      ward: { type: String },
      address: { type: String },
      addressType: { type: String },
    },
  ],
  role: { type: String, default: "user" },
  avatar: { type: String, },
  createdAt: { type: Date, default: Date.now() },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

//  Hash password
userSchema.pre("save", async function (next) {
  if (this.fromGoogle) {
    this.password = "";
  } else {
    if (!this.isModified("password")) {
      next();
    }

    this.password = await bcrypt.hash(this.password, 10);
  }
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
