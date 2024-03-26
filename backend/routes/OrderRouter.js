const router = require("express").Router();
const orderController = require("../controller/order");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");

// create new order
router.post("/create-order", orderController.createOrder);

// get all orders of user
router.get("/get-all-orders/:userId", orderController.getAllOrder);

// get all orders of seller
router.get("/get-seller-all-orders/:shopId", orderController.getSellerAllOrder);

// update order status for seller
router.put("/update-order-status/:id", isSeller, orderController.updateOrderStatus);

// give a refund ----- user
router.put("/order-refund/:id", orderController.orderRefund);

// accept the refund ---- seller
router.put("/order-refund-success/:id", isSeller, orderController.orderRefundSuccess);

// all orders --- for admin
router.get("/admin-all-orders", isAuthenticated, isAdmin("Admin"), orderController.adminAllOrder);

module.exports = router;