const express = require("express");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const userEmail = await User.findOne({ email });

      if (userEmail) {
        return res.status(200).json({
          success: false,
          message: `This email is used`,
        });
      }

      const otp = Math.floor(Math.random() * 9000) + 1000;
      await sendMail({
        email: email,
        subject: "Register account",
        message: `Hello ${name} \nYour OTP is: ` + otp,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email:- ${email} to recieve OTP!`,
        data: otp,
      });
    } catch (error) {
      return res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  },

  activationUser: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      user = await User.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: `Account is created successfully`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email }).select("+password");

      if (!user) return next(new ErrorHandler("User doesn't exists!", 400));

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid)
        return next(new ErrorHandler("Password is wrong", 400));

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  googleAuth: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        sendToken(user, 201, res);
      } else {
        const newUser = new User({
          ...req.body,
          fromGoogle: true,
        });

        const savedUser = await newUser.save();
        sendToken(user, 201, res);
      }
    } catch (err) {
      next(err);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate({
        path: "cart.product",
        populate: {
          path: "discount",
          model: "Discount",
        },
      });

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  },

  logout: async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  updateAvatar: async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      existsUser.avatar = req.body.avatar;
      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  userInfoById: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).populate("cart.product");

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  updateUerInfo: async (req, res, next) => {
    try {
      const { phoneNumber, name, email } = req.body;
      console.log(req.body);

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      user.name = name;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  addCart: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      user.cart.push({
        product: req.body.product,
        quantity: req.body.quantity,
      });
      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  },

  removeItemCart: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate("cart.product");
      user.cart = user.cart.filter(
        (item) => item.product._id.toString() !== req.params.id
      );

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  },

  changeQuantityItemCart: async (req, res, next) => {
    try {
      const { id, quantity } = req.params;
      const user = await User.findById(req.user.id).populate("cart.product");
      user.cart = user.cart.map((item) => {
        if (item.product._id.toString() === id)
          return {
            ...item,
            quantity: parseInt(quantity, 10),
          };
        else return item;
      });
      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  },

  updateAddress: async (req, res, next) => {
    try {
      let user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      user = await user.save();
      console.log(user.addresses);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  deleteAddress: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);
      console.log(user.addresses);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },

  updatePassword: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
};

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};
