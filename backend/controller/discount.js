const Shop = require("../model/shop");
const Discount = require("../model/discount");
const Product = require("../model/product");
const ErrorHandler = require("../utils/ErrorHandler");

module.exports = {
  createDiscount: async (req, res, next) => {
    try {
      const checkPercent = await Discount.findOne({
        percent: req.body.percent,
      });

      if (checkPercent)
        return res.status(400).json({
          success: false,
          message: "Discount already exists!",
          data: null,
        });

      const newDiscount = await Discount.create({
        percent: parseInt(req.body.percent),
        startDay: new Date(req.body.startDay),
        endDay: new Date(req.body.endDay),
        shop: req.body.shop,
        productList: req.body.productList,
        status: false,
      });

      res
        .status(201)
        .json({ success: true, message: "Create success", data: newDiscount });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },

  getAllDiscountByIdSeller: async (req, res, next) => {
    try {
      const discount = await Discount.find({ shop: req.seller.id });
      res.status(201).json({
        success: true,
        data: discount,
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
      await Product.updateMany(
        { discount: req.params.id },
        { $unset: { discount: 1 } }
      );
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
      const checkPercent = await Discount.findOne({
        percent: req.body.percent,
        _id: { $ne: req.body._id },
      });

      if (checkPercent) {
        return res.status(400).json({
          success: false,
          message: "Discount already exists!",
          data: null,
        });
      }

      let discount = await Discount.findById(req.body._id);

      if (!discount) {
        return next(new ErrorHandler("Discount dosen't exists!", 400));
      }

      if (discount.productList.length > 0) {
        await Product.updateMany(
          { _id: { $in: discount.productList } },
          { $unset: { discount: 1 } }
        );
      }

      const currentDate = new Date(); // Lấy ngày hiện tại

      const startDate = new Date(req.body.startDay);
      const endDate = new Date(req.body.endDay);

      const isInRange = currentDate >= startDate && currentDate <= endDate;

      discount = await Discount.findByIdAndUpdate(
        req.body._id,
        {
          ...req.body,
          status: isInRange,
        },
        { new: true }
      );

      await Product.updateMany(
        { _id: { $in: discount.productList } },
        { discount: discount._id }
      );

      res.status(201).json({
        success: true,
        message: "Discount updated successfully!",
        data: discount,
      });
    } catch (error) {
      console.log(JSON.stringify(error));
      return next(new ErrorHandler(error, 400));
    }
  },
};

const checkUpdateDiscount = async () => {
  const currentDate = new Date();
  let discounts = await Discount.find()

  discounts.forEach(async item => {
    if (item.startDay <= currentDate && item.endDay >= currentDate && !item.status) {
      d = await Discount.findByIdAndUpdate(
        item._id,
        {
          status: true,
        },
        { new: true }
      );
      // console.log("d"+d)
    }
  });

  discounts.forEach(async item => {
    if (!(item.startDay <= currentDate && item.endDay >= currentDate) && item.status) {
      a=await Discount.findByIdAndUpdate(
        item._id,
        {
          status: false,
        },
        { new: true }
      );
      // console.log("a"+a)
    }
  });

  // console.log(discounts);
};

setInterval(checkUpdateDiscount, 60000);
