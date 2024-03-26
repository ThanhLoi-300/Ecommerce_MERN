const router = require("express").Router();
const paymentController = require("../controller/payment");

router.get("/stripeapikey", paymentController.stripeapikey);
router.post("/process", paymentController.process);

module.exports = router;