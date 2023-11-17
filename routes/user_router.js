const express = require('express');
const user_router = express.Router();
const user_controller = require('../controller/user_controller/user_login')



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




module.exports = user_router
