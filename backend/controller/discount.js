const express = require("express");
const Shop = require("../model/shop");
const Discount = require("../model/discount");
const ErrorHandler = require("../utils/ErrorHandler");

module.exports = {
  createDiscount: async (req, res, next) => {
    try {
      const checkPercent = await Discount.findOne({
        percent: req.body.percent,
      });

      if (checkPercent)
        return res
          .status(400)
          .json({
            success: false,
            message: "Discount already exists!",
            data: null,
          });

      const newDiscount = await Discount.create({
        ...req.body,
        shop: req.seller.id,
        productList: [],
      });

      res.status(201).json({ success: true, newDiscount });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  getAllDiscountByIdSeller: async (req, res, next) => {
    try {
      const discount = await Discount.find({ shop: req.seller.id });
      res.status(201).json({
        success: true,
        discount,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  getDiscountById: async (req, res, next) => {
    try {
      const discount = await Discount.findById(req.params.id).populate(
        "productList"
      );

      res.status(200).json({
        success: true,
        discount,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  deleteDiscount: async (req, res, next) => {
    try {
      const discount = await Discount.findByIdAndDelete(req.params.id);

      // Cập nhật các sản phẩm đang giảm giá về null
      await Product.updateMany({ discount: req.params.id }, { discount: null });
      if (!discount) {
        return next(new ErrorHandler("Discount dosen't exists!", 400));
      }
      res.status(201).json({
        success: true,
        message: "Discount deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  updateDiscount: async (req, res, next) => {
    try {
      const discount = await Discount.findByIdAndUpdate(
        req.body.id,
        updatedData,
        { new: true }
      );

      if (!discount) {
        return next(new ErrorHandler("Discount dosen't exists!", 400));
      }

      res.status(201).json({
        success: true,
        message: "Discount updated successfully!",
        data: discount,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },
};
