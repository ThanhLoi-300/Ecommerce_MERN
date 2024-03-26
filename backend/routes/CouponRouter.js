const router = require('express').Router()
const coupounCodetController = require('../controller/coupounCode')
const { isSeller } = require('../middleware/auth')

// create coupoun code
router.post("/create-coupon-code", isSeller, coupounCodetController.createCouponCode);
// get all coupons of a shop
router.get("/get-coupon/:id", isSeller, coupounCodetController.getAllCoupons);
// get coupon code value by its name
router.get("/get-coupon-value/:name", coupounCodetController.getCouponCode);
// delete coupoun code of a shop
router.delete("/delete-coupon/:id", isSeller, coupounCodetController.deleteCouponCode);

module.exports = router