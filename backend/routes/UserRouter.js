const router = require('express').Router()
const userController = require('../controller/user');
const { isAuthenticated } = require('../middleware/auth');

// create user
router.post("/create-user", userController.createUser)
// activate user
router.post("/activation", userController.activationUser);
// login user
router.post("/login-user", userController.loginUser);
// login Google
router.post("/google", userController.googleAuth)
// load user
router.get("/getuser", isAuthenticated, userController.getUser);
// log out user
router.get("/logout", userController.logout);
// update user avatar
router.put("/update-avatar", isAuthenticated, userController.updateAvatar);
// find user infoormation with the userId
router.get("/user-info/:id", userController.userInfoById);
// update user info
router.put("/update-user-info", isAuthenticated, userController.updateUerInfo);
// add cart
router.post("/add-cart", isAuthenticated, userController.addCart);
// remove-item-cart
router.get("/remove-item-cart/:id", isAuthenticated, userController.removeItemCart);
// change-quantity-item-cart
router.get("/change-quantity-item-cart/:id/:quantity", isAuthenticated, userController.changeQuantityItemCart);
// update user addresses
router.put("/update-user-addresses", isAuthenticated, userController.updateAddress);
// delete user address
router.delete("/delete-user-address/:id", isAuthenticated, userController.deleteAddress);
// update user password
router.put("/update-user-password", isAuthenticated, userController.updatePassword);


module.exports = router