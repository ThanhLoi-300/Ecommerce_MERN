const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");

module.exports = {
  createOrder: async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo, discountPrice } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
          discountPrice
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      consolelog(error)
      return next(new ErrorHandler(error.message, 500));
    }
  },

  getAllOrder: async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  getSellerAllOrder: async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.product.shop": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      console.log(req.body.status)
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      if (req.body.status === "Shipping") {
        order.cart.forEach(async (o) => {
          await updateOrder(o.product._id, o.quantity);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Received") {
        order.status = "Delivered";
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;
        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        var id = req.seller?.id ? req.seller.id : req.body.idSeller
        const seller = await Shop.findById(id);

        seller.availableBalance += amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};


