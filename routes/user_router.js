const express = require('express');
const user_router = express.Router();
user_router.use(express.json());
const userError = require('../middleware/userError');
const userAuth = require('../middleware/userAuth');
const userBlock = require('../middleware/userBlock');
const user_controller = require('../controller/user_controller/user_login');
const user_cart = require('../controller/user_controller/user_cart');
const user_profile = require('../controller/user_controller/user_profile');
const user_address = require('../controller/user_controller/user_address');
const user_order = require('../controller/user_controller/user_order');
const userProfileUpload = require('../middleware/multer');

user_router.use('/', express.static('public'));


user_router
.get('/', userBlock.ifBlocked, user_controller.getHomePage)

user_router
.route("/login")
.get(user_controller.getUserLogin, userError.errorHandler)

user_router
.route("/postLogin")
.post(user_controller.postUserLogin)

user_router
.route("/logout")
.get(user_controller.getUserLogout)

user_router
.route("/signup")
.get(user_controller.getUserSignup)

user_router
.route('/postSignup')
.post(user_controller.postUserSignup)

user_router
.route("/sendOtp")
.get(user_controller.getSendOtp)

user_router
.route("/verifyOtp")
.post(user_controller.verifyOTP)

user_router
.get('/productDetails/:product_id', userBlock.ifBlocked,  user_controller.getProductDetails)

user_router
.route("/forgotPassword")
.get(user_controller.getforgotPassword)

user_router
.route('/forgotSendOtp')
.get(user_controller.getforgotSendOtp)

user_router
.route('/forgotVerifyOtp')
.post(user_controller.forgotVerifyOtp)

user_router
.route('/forgotChangePassword')
.post(user_controller.forgotChangePassword)

//cart
user_router.get('/cart', userAuth.userSession, userBlock.ifBlocked, user_cart.getCart)
user_router.post('/addtoCart', user_cart.addtoCart)
user_router.post('/updateCart', userAuth.userSession, userBlock.ifBlocked, user_cart.updateCart)
user_router.post('/removeFromCart', userAuth.userSession, userBlock.ifBlocked, user_cart.removeCart)
user_router.get('/checkout', userAuth.userSession, userBlock.ifBlocked, user_cart.checkout)
user_router.get('/profile', userAuth.userSession, userBlock.ifBlocked, user_profile.getProfile);
user_router.post('/edit-profile', userAuth.userSession, userBlock.ifBlocked, user_profile.editProfile);
user_router.post('/change-password', userAuth.userSession, userBlock.ifBlocked, user_profile.changePassword);
user_router.get('/view-order', userAuth.userSession, userBlock.ifBlocked, user_profile.viewOrders);
user_router.get('/add-address', userAuth.userSession, userBlock.ifBlocked, user_address.getAddAddress);
user_router.post('/post-add-address', userAuth.userSession, userBlock.ifBlocked, user_address.postAddAddress);
user_router.get('/edit-address', userAuth.userSession, userBlock.ifBlocked, user_address.getEditAddress);
user_router.post('/post-edit-address', userAuth.userSession, userBlock.ifBlocked, user_address.postEditAddress);
user_router.get('/delete-address', userAuth.userSession, userBlock.ifBlocked, user_address.deleteAddress);
user_router.get('/order-placed/cod', userAuth.userSession, userBlock.ifBlocked, user_order.getOrderPlacedCod);
user_router.get('/cancel-order/:orderId', userAuth.userSession, userBlock.ifBlocked, user_order.cancelOrder);


user_router.use(userError.errorHandler);

module.exports = user_router
