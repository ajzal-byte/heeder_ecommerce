const express = require('express');
const admin_router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const admin_controller = require('../controller/admin_controller/admin_login');
const category = require('../controller/admin_controller/admin_category');
const brands = require('../controller/admin_controller/admin_brands');
const products = require('../controller/admin_controller/admin_products');
const users= require('../controller/admin_controller/admin_users');
const orders = require('../controller/admin_controller/admin_orders')
const coupons = require('../controller/admin_controller/admin_coupon')
const offers = require('../controller/admin_controller/admin_offers');
const sales = require('../controller/admin_controller/admin_sales');
const banner = require('../controller/admin_controller/admin_banner');
const salesReport = require('../helpers/salesReportExcel');
const {upload, bannerUpload} = require('../middleware/multer');
const path = require('path')

// admin_router.use('/uploads', express.static('uploads'));
// admin_router.use('/public', express.static('public'));
// admin_router.use('/admin/public', express.static('public'));
// admin_router.use('/uploads', express.static('uploads'))
// admin_router.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// admin_router.use('public/', express.static('public'));

admin_router.use('/', express.static('public'));


//login and homepage
admin_router.get(['/', '/login'], admin_controller.getAdminRoute);
admin_router.post('/post-login', admin_controller.postAdminRoute);
admin_router.get('/logout', admin_controller.getAdminLogout)
admin_router.get('/dashboard',adminAuth.adminSession, admin_controller.getAdminDashboard)

//category management
admin_router
.get('/categories', adminAuth.adminSession, category.getCategories);
admin_router.post('/addCategories', adminAuth.adminSession, category.addCategories);
admin_router.get('/editCategories/:category_id', adminAuth.adminSession, category.editCategories)
admin_router.post('/updateCategories', adminAuth.adminSession, category.updateCategories);
admin_router.get('/blockCategories/:category_id', adminAuth.adminSession, category.blockCategories);
admin_router.get('/unblockCategories/:category_id', adminAuth.adminSession, category.unblockCategories);

//brands management
admin_router.get('/brands', adminAuth.adminSession, brands.getBrands);
admin_router.post('/addBrands', adminAuth.adminSession, brands.addBrands);
admin_router.get('/editBrands/:brand_id', adminAuth.adminSession, brands.editBrands);
admin_router.post('/updateBrands', adminAuth.adminSession, brands.updateBrands);
admin_router.get('/blockBrands/:brand_id', adminAuth.adminSession, brands.blockBrands);
admin_router.get('/unblockBrands/:brand_id', adminAuth.adminSession, brands.unblockBrands);

//products management
admin_router.get('/products', adminAuth.adminSession, products.getProducts);
admin_router.get('/addProduct', adminAuth.adminSession, products.getAddProduct);
admin_router.post('/postAddProduct', upload.array('productImages'),products.postAddProduct);
admin_router.get('/blockProduct/:product_id', adminAuth.adminSession, products.blockProduct);
admin_router.get('/unblockProduct/:product_id', adminAuth.adminSession, products.unblockProduct);
admin_router.get('/editProduct/:product_id', adminAuth.adminSession,products.editProduct);
admin_router.post('/updateProduct/:product_id', upload.array('productImages'),products.updateProduct);
admin_router.get('/delete_image', adminAuth.adminSession, products.deleteImage);


//users management
admin_router.get('/users', adminAuth.adminSession,  users.getUsers);
admin_router.get('/blockUsers/:user_id', adminAuth.adminSession, users.blockUser);
admin_router.get('/unblockUsers/:user_id', adminAuth.adminSession, users.unblockUser);

//order management
admin_router.get('/orders', adminAuth.adminSession, orders.getOrders);
admin_router.get('/view-order/:orderId', adminAuth.adminSession, orders.viewOrder);
admin_router.get('/dispatch-order/:orderId', adminAuth.adminSession, orders.dispatchOrder);
admin_router.get('/cancel-order/:orderId', adminAuth.adminSession, orders.cancelOrder);
admin_router.get('/deliver-order/:orderId', adminAuth.adminSession, orders.deliverOrder);

//coupons
admin_router.get('/coupons', adminAuth.adminSession, coupons.getCoupons);
admin_router.get('/add-coupon', adminAuth.adminSession, coupons.getAddCoupon );
admin_router.post('/post-add-coupon', adminAuth.adminSession, coupons.postAddCoupon );
admin_router.get('/edit-coupon/:coupon_id', adminAuth.adminSession, coupons.getEditCoupon );
admin_router.post('/post-edit-coupon/:coupon_id', adminAuth.adminSession, coupons.postEditCoupon );
admin_router.get('/block-coupon/:coupon_id', adminAuth.adminSession, coupons.blockCoupon );
admin_router.get('/unblock-coupon/:coupon_id', adminAuth.adminSession, coupons.unblockCoupon );

//offers
admin_router.get('/offers', adminAuth.adminSession, offers.getOffers);
admin_router.get('/add-offer', adminAuth.adminSession, offers.getAddOffer );
admin_router.post('/post-add-offer', adminAuth.adminSession, offers.postAddOffer );
admin_router.get('/edit-offer/:offerId', adminAuth.adminSession, offers.getEditOffer );
admin_router.post('/post-edit-offer/:offerId', adminAuth.adminSession, offers.postEditOffer );
admin_router.get('/block-offer/:offerId', adminAuth.adminSession, offers.blockOffer );
admin_router.get('/unblock-offer/:offerId', adminAuth.adminSession, offers.unblockOffer );

//sales
admin_router.get('/sales-report', adminAuth.adminSession, sales.getSalesReport);
admin_router.get('/filter-report', adminAuth.adminSession, sales.filterSalesReport);
admin_router.get('/sales-excel', adminAuth.adminSession, salesReport.salesExcel)

//banner
admin_router.get('/banners', adminAuth.adminSession, banner.getBanners);
admin_router.get('/add-banner', adminAuth.adminSession, banner.getAddBanner);
admin_router.post('/post-add-banner', adminAuth.adminSession, bannerUpload.single('image'), banner.postAddBanner);
admin_router.get('/edit-banner/:bannerId', adminAuth.adminSession, banner.getEditBanner);
admin_router.post('/post-edit-banner/:bannerId', adminAuth.adminSession, bannerUpload.single('image'), banner.postEditBanner);
admin_router.get('/block-banner/:bannerId', adminAuth.adminSession, banner.blockBanner);
admin_router.get('/unblock-banner/:bannerId', adminAuth.adminSession, banner.unblockBanner);

module.exports = admin_router
