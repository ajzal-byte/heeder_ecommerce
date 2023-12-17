const express = require('express');
const user_router = express.Router();
user_router.use(express.json());
const userError = require('../middleware/userError');
const userAuth = require('../middleware/userAuth');
const userBlock = require('../middleware/userBlock');
const user_home = require('../controller/user_controller/user_home');
const user_login = require('../controller/user_controller/user_login');
const user_cart = require('../controller/user_controller/user_cart');
const user_profile = require('../controller/user_controller/user_profile');
const user_address = require('../controller/user_controller/user_address');
const user_order = require('../controller/user_controller/user_order');
const {userProfileUpload} = require('../middleware/multer');

user_router.use('/', express.static('public'));
user_router.use('/productDetails', express.static('public'));
user_router.use('/view-order', express.static('public'));


//home
user_router.get('/', userBlock.ifBlocked, user_home.getHomePage)

//login
user_router.get('/login', user_login.getUserLogin)
user_router.post('/postLogin', user_login.postUserLogin)
user_router.get('/logout', user_login.getUserLogout)

//signup
user_router.get('/signup', user_login.getUserSignup)
user_router.post('/postSignup', user_login.postUserSignup)

//otp
user_router.get('/sendOtp', user_login.getSendOtp)
user_router.post('/verifyOtp', user_login.verifyOTP)

//forgotPassword
user_router.get('/forgotPassword', user_login.getforgotPassword)
user_router.get('/forgotSendOtp', user_login.getforgotSendOtp)
user_router.post('/forgotVerifyOtp', user_login.forgotVerifyOtp)
user_router.post('/forgotChangePassword', user_login.forgotChangePassword)

//products
user_router.get('/products', userBlock.ifBlocked, user_home.getProducts)
user_router.get('/productDetails/:product_id', userBlock.ifBlocked,  user_home.getProductDetails)

//cart
user_router.get('/cart', userAuth.userSession, userBlock.ifBlocked, user_cart.getCart)
user_router.post('/addtoCart', user_cart.addtoCart)
user_router.post('/updateCart', userAuth.userSession, userBlock.ifBlocked, user_cart.updateCart)
user_router.post('/removeFromCart', userAuth.userSession, userBlock.ifBlocked, user_cart.removeCart)
user_router.get('/checkout', userAuth.userSession, userBlock.ifBlocked, user_cart.checkout)

//profile
user_router.get('/profile', userAuth.userSession, userBlock.ifBlocked, user_profile.getProfile);
user_router.post('/edit-profile', userProfileUpload.single('profileImage'), userAuth.userSession, userBlock.ifBlocked, user_profile.editProfile);
user_router.post('/change-password', userAuth.userSession, userBlock.ifBlocked, user_profile.changePassword);
user_router.get('/view-order', userAuth.userSession, userBlock.ifBlocked, user_order.viewOrders);

//address
user_router.get('/add-address', userAuth.userSession, userBlock.ifBlocked, user_address.getAddAddress);
user_router.post('/post-add-address', userAuth.userSession, userBlock.ifBlocked, user_address.postAddAddress);
user_router.get('/edit-address', userAuth.userSession, userBlock.ifBlocked, user_address.getEditAddress);
user_router.post('/post-edit-address', userAuth.userSession, userBlock.ifBlocked, user_address.postEditAddress);
user_router.get('/delete-address', userAuth.userSession, userBlock.ifBlocked, user_address.deleteAddress);

//orders
user_router.get('/order-placed/cod', userAuth.userSession, userBlock.ifBlocked, user_order.getOrderPlacedCod);
user_router.get('/cancel-order/:orderId', userAuth.userSession, userBlock.ifBlocked, user_order.cancelOrder);
user_router.get('/return-order/:orderId', userAuth.userSession, userBlock.ifBlocked, user_order.returnOrder);



user_router.use(userError.errorHandler);

module.exports = user_router
