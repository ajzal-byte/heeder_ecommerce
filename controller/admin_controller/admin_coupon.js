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