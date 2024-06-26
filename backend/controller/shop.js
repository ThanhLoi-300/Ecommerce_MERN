const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const User = require("../model/user");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

module.exports = {
  createShop: async (req, res, next) => {
    try {
      const user = await User.findById(req.body.idUser)
      const seller = await Shop.create({
        nameShop: req.body.nameShop,
        address: req.body.address,
        //zipCode: req.body.zipCode,
        user: req.body.idUser
      });

      user.phoneNumber = req.body.phoneNumber
      await user.save()

      try {
        // await sendMail({
        //   email: req.body.email,
        //   subject: "Creating your Shop",
        //   message: `Hello ${req.body.nameShop}, Your Shop is created successfully`,
        // });
        res.status(201).json({
          success: true,
          message: `Your Shop is created successfully`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  },

  getSeller: async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id).populate('user');

      if (!seller) return next(new ErrorHandler("User doesn't exists", 400));

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  getInfoShop: async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id).populate('user');

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsSeller = await Shop.findById(req.seller._id);

      const imageId = existsSeller.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      existsSeller.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);