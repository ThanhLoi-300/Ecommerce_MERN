const express = require("express");
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");

module.exports = {
  createProduct: async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);

      if (!shop) return next(new ErrorHandler("Shop Id is invalid!", 400));
      else {
        const productData = req.body;
        productData.shop = shopId;

        const product = await Product.create(productData);

        res.status(201).json({ success: true, product });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  getAllProductByShopId: async (req, res, next) => {
    try {
      const products = await Product.find({ shop: req.params.id }).populate('shop').populate('reviews.user').populate('discount').populate({
        path: 'shop',
        populate: {
          path: 'user',
          model: 'User'
        }
      });
      
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  delete: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product)
        return next(new ErrorHandler("Product is not found with this id", 404));

      await product.remove();

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  getAllProducts: async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 }).populate({
        path: 'shop',
        populate: {
          path: 'user',
          model: 'User'
        }
      }).populate('reviews.user').populate('discount');

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  createNewReview: async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler(error, 400));
    }
  },
};
