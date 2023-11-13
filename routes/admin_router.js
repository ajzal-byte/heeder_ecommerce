const express = require('express');
const admin_router = express.Router();
const admin_controller = require('../controller/admin_controller/admin_login');
const category = require('../controller/admin_controller/admin_category')

admin_router
.route("/")
.get(admin_controller.getAdminRoute)
.post(admin_controller.postAdminRoute);

admin_router
.route('/adminLogout')
.get(admin_controller.getAdminLogout)

admin_router
.route('/dashboard')
.get(admin_controller.getAdminDashboard)

admin_router
.route("/categories")
.get(category.getCategories);

admin_router
.route("/addCategories")
.post(category.addCategories);

admin_router
.route('/editCategories/:category_id')
.get(category.editCategories)

admin_router
.route('/updateCategories/:category_id')
.post(category.updateCategories);







module.exports = admin_router
