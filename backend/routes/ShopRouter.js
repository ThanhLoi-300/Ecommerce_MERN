const router = require('express').Router()
const shopController = require('../controller/shop')
const { isSeller } = require('../middleware/auth')

// create shop
router.post("/create-shop", shopController.createShop)
// load shop
router.get("/getSeller", isSeller, shopController.getSeller);
// get shop info
router.get("/get-shop-info/:id", shopController.getInfoShop);

module.exports = router