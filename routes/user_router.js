const express = require('express');
const user_router = express.Router();
const userAuth = require('../middleware/userAuth')
const user_controller = require('../controller/user_controller/user_login');
const user_cart = require('../controller/user_controller/user_cart');
const productCollection = require('../models/products_schema')
const category = require('../models/category_schema')
const userCollection = require('../models/user_schema');

user_router
.get('/', async (req,res)=>{
  const products = await productCollection.find().populate({path:'category', model:'Categories'})
  const userSession = req.session.user;
  res.render('user_index', {products, userSession});
});

user_router
.route("/login")
.get(user_controller.getUserLogin)

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
.route('/productDetails/:product_id')
.get(user_controller.getProductDetails)

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
user_router.get('/cart', userAuth.userSession, user_cart.getCart)
user_router.post('/addtoCart', user_cart.addtoCart)
user_router.post('/updateCart', userAuth.userSession, user_cart.updateCart)
user_router.post('/removeFromCart', userAuth.userSession, user_cart.removeCart)



module.exports = user_router
