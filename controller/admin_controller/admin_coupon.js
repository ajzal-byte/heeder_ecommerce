const couponCollection = require("../../models/coupon_schema");

const getCoupons = async (req, res)=>{
  try{
    const coupons = await couponCollection.find();
    res.render('coupon_page', {coupons});
  }catch(error){
    console.error(error);
  }
}

const getAddCoupon = async (req, res)=>{
  try{
    res.render('coupon-add');
  }catch(error){
    console.error(error);
  }
}

const postAddCoupon = async (req, res)=>{
  try{
    const couponCode = req.query.couponCode;
    const ifExist = await couponCollection.findOne({couponCode});
    if (ifExist) {
      return res.status(200).json({error: "This Coupon already exists"});
    }
    const { description, discountAmount, minimumPurchase, status, expiryDate} = req.body;
    await couponCollection.create({
      couponCode, description, discountAmount, minimumPurchase, status, expiryDate
    });
    return res.status(200).json({success : true});
  }catch(error){
    console.error(error);
  }
}

const getEditCoupon = async (req, res)=>{
  try{
    const coupon_id = req.params.coupon_id;
    const coupon_edit = await couponCollection.findOne({_id: coupon_id});
    res.render('coupon-edit', {coupon_edit});
  }catch(error){
    console.error(error);
  }
}

const postEditCoupon = async (req, res)=>{
  try{
    const coupon_id = req.params.coupon_id; 
    const couponCode = req.query.couponCode;
    const ifExist = await couponCollection.findOne({ couponCode, _id: { $ne: coupon_id } });
    if (ifExist) {
      return res.status(200).json({error: "This Coupon already exists"});
    }
    const { description, discountAmount, minimumPurchase, status, expiryDate} = req.body;
    await couponCollection.findByIdAndUpdate(coupon_id, {
      couponCode, description, discountAmount, minimumPurchase, status, expiryDate
    })
    return res.status(200).json({success : true});
  }catch(error){
    console.error(error);
  }
}

const blockCoupon = async(req, res)=>{
  try{
    const coupon_id = req.params.coupon_id;
    await couponCollection.findByIdAndUpdate(coupon_id, {status: 'Inactive'});
    res.redirect('/admin/coupons');
  }catch(error){
    console.error(error);
  }
}

const unblockCoupon = async(req, res)=>{
  try{
    const coupon_id = req.params.coupon_id;
    await couponCollection.findByIdAndUpdate(coupon_id, {status: 'Active'});
    res.redirect('/admin/coupons');
  }catch(error){
    console.error(error);
  }
}

module.exports = {
  getCoupons,
  getAddCoupon,
  postAddCoupon,
  getEditCoupon,
  postEditCoupon,
  blockCoupon,
  unblockCoupon
}