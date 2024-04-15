const router = require("express").Router();
const productController = require("../controller/product");
const { isSeller, isAuthenticated } = require("../middleware/auth");

// create product
router.post("/create-product", isSeller, productController.createProduct);
// get all products of a shop
router.get("/get-all-products-shop/:id", productController.getAllProductByShopId);
// delete product of a shop
router.delete("/delete-shop-product/:id", isSeller, productController.delete);
// get all products
router.get("/get-all-products", productController.getAllProducts);
// review for a product
router.put("/create-new-review", isAuthenticated, productController.createNewReview);

module.exports = router;
