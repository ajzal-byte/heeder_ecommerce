const couponCollection = require("../../models/coupon_schema");

module.exports.getCoupons = async (req, res)=>{
  try{
    const coupons = await couponCollection.find();
    res.render('coupon_page', {coupons});
  }catch(error){
    console.error(error);
  }
}

module.exports.getAddCoupon = async (req, res)=>{
  try{
    res.render('coupon-add');
  }catch(error){
    console.error(error);
  }
}

module.exports.postAddCoupon = async (req, res)=>{
  try{
    const {couponCode, description, discountAmount, minimumPurchase, status, expiryDate} = req.body;
    await couponCollection.create({
      couponCode, description, discountAmount, minimumPurchase, status, expiryDate
    });
  }catch(error){
    console.error(error);
  }
}

module.exports.getEditCoupon = async (req, res)=>{
  try{
    const coupon_id = req.params.coupon_id;
    const coupon_edit = await couponCollection.findOne({_id: coupon_id});
    res.render('coupon-edit', {coupon_edit});
  }catch(error){
    console.error(error);
  }
}

module.exports.postEditCoupon = async (req, res)=>{
  try{
    const coupon_id = req.params.coupon_id;
    const {couponCode, description, discountAmount, minimumPurchase, status, expiryDate} = req.body;
    await couponCollection.findByIdAndUpdate(coupon_id, {
      couponCode, description, discountAmount, minimumPurchase, status, expiryDate
    })
    res.redirect('/admin/coupons')
  }catch(error){
    console.error(error);
  }
}

module.exports.blockCoupon = async(req, res)=>{
  try{
    const coupon_id = req.params.coupon_id;
    await couponCollection.findByIdAndUpdate(coupon_id, {status: 'Inactive'});
    res.redirect('/admin/coupons');
  }catch(error){
    console.error(error);
  }
}

module.exports.unblockCoupon = async(req, res)=>{
  try{
    const coupon_id = req.params.coupon_id;
    await couponCollection.findByIdAndUpdate(coupon_id, {status: 'Active'});
    res.redirect('/admin/coupons');
  }catch(error){
    console.error(error);
  }
}