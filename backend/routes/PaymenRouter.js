const router = require("express").Router();
const paymentController = require("../controller/payment");

router.get("/stripeapikey", paymentController.stripeapikey);
router.post("/process", paymentController.process);
router.post("/createLink-momo", paymentController.createLinkMomo);
router.post("/callback", paymentController.callback);
router.post("/check-status-transaction", paymentController.checkStatusTransaction);

module.exports = router;