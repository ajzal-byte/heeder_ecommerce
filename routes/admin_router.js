const express = require('express');
const admin_router = express.Router();
const admin_controller = require('../controller/admin_controller/admin_login');
const category = require('../controller/admin_controller/admin_category');
const products = require('../controller/admin_controller/admin_products');
const upload = require('../middleware/multer')

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

admin_router
.route('/blockCategories/:category_id')
.get(category.blockCategories);

admin_router
.route('/unblockCategories/:category_id')
.get(category.unblockCategories);


admin_router
.route('/products')
.get(products.getProducts);

admin_router
.route('/addProduct')
.get(products.getAddProduct);

admin_router
.route('/postAddProduct')
.post(upload.array('productImages', 5),products.postAddProduct);

admin_router
.route('/blockProduct/:product_id')
.get(products.blockProduct);

admin_router
.route('/unblockProduct/:product_id')
.get(products.unblockProduct);

admin_router
.route('/editProduct/:product_id')
.get(products.editProduct);

admin_router
.route('/updateProduct/:product_id')
.post(products.updateProduct);

module.exports = admin_router
