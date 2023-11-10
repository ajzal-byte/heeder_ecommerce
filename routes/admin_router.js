const express = require('express');
const admin_router = express.Router();
const admin_controller = require('../controller/admin_controller/admin_login');
const category = require('../controller/admin_controller/admin_category')

admin_router
.route("/")
.get(admin_controller.getAdminRoute)
.post(admin_controller.postAdminRoute);

admin_router
.route("/categories")
.get(category.getCategories);

module.exports = admin_router
