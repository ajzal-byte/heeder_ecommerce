const express = require('express');
const admin_router = express.Router();
const admin_controller = require('../controller/admin_controller/admin_login');
const category = require('../controller/admin_controller/admin_category');
const brands = require('../controller/admin_controller/admin_brands');
const products = require('../controller/admin_controller/admin_products');
const users= require('../controller/admin_controller/admin_users');
const orders = require('../controller/admin_controller/admin_orders')
const upload = require('../middleware/multer');
const path = require('path')


// admin_router.use('/uploads', express.static('uploads'));
admin_router.use('/public', express.static('public'));
// admin_router.use('/admin/public', express.static('public'));
// admin_router.use('/uploads', express.static('uploads'))
// admin_router.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// admin_router.use('public/', express.static('public'));

admin_router.use('/', express.static('public'));



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
.route('/updateCategories')
.post(category.updateCategories);

admin_router
.route('/blockCategories/:category_id')
.get(category.blockCategories);

admin_router
.route('/unblockCategories/:category_id')
.get(category.unblockCategories);

admin_router
.route("/brands")
.get(brands.getBrands);

admin_router
.route("/addBrands")
.post(brands.addBrands);

admin_router
.route('/editBrands/:brand_id')
.get(brands.editBrands);

admin_router
.route('/updateBrands')
.post(brands.updateBrands);

admin_router
.route('/blockBrands/:brand_id')
.get(brands.blockBrands);

admin_router
.route('/unblockBrands/:brand_id')
.get(brands.unblockBrands);


admin_router
.route('/products')
.get(products.getProducts);

admin_router
.route('/addProduct')
.get(products.getAddProduct);

admin_router
.route('/postAddProduct')
.post(upload.array('productImages'),products.postAddProduct);

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
.post(upload.array('productImages'),products.updateProduct);

admin_router
.route('/delete_image')
.get(products.deleteImage);

admin_router
.route('/users')
.get(users.getUsers);

admin_router
.route('/blockUsers/:user_id')
.get(users.blockUser);

admin_router
.route('/unblockUsers/:user_id')
.get(users.unblockUser);

admin_router
.route('/orders')
.get(orders.getOrders);

module.exports = admin_router
