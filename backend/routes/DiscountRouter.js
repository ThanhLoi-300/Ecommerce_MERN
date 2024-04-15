const router = require("express").Router();
const discountController = require("../controller/discount");
const { isSeller } = require("../middleware/auth");

// create a new discount
router.post("/create-new-discount", isSeller, discountController.createDiscount);

// get seller discount by id seller
router.get("/get-all-discount-seller", isSeller, discountController.getAllDiscountByIdSeller);

// get discount by id
router.get("/get-discount/:id", discountController.getDiscountById);

// delete discount
router.get("/delete-discount/:id", discountController.deleteDiscount);

// update discount
router.post("/update-discount", discountController.updateDiscount);

module.exports = router;
