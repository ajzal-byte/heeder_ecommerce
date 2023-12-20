const userCollection = require('../../models/user_schema');
const addressCollection = require('../../models/address_schema');
const cartCollection = require('../../models/cart_schema');
const couponCollection = require('../../models/coupon_schema');


module.exports.checkout = async (req, res, next)=>{
  try{
    let grandTotal = 0;
    const userSession = req.session.user;
    let cartLength;
    if(userSession){
      const user = await userCollection.findOne({email: userSession.email})
      cartLength = await cartCollection.findOne({userId: user._id});
      if (cartLength && cartLength.products) {
        // Check if the cart and its products for the user exists
        cartLength = cartLength.products.length;
      }
    }
    const user = await userCollection.findOne({email: userSession.email});
    const userAddress = await addressCollection.findOne({userId: user._id});
    const userCart = await cartCollection.findOne(
      {userId: user._id}).populate({path: 'products.productId', model:'Product', populate: {path: 'brand', model: 'brandCollection'}});
        if(userCart && userCart.products.length > 0){
          for(let i = 0; i < userCart.products.length; i++){
            if(userCart.products[i].quantity > userCart.products[i].productId.stock || userCart.products[i].productId.stock == 0){
              return res.redirect('/cart')
            } 
            let subTotal = userCart.products[i].quantity * userCart.products[i].productId.salePrice;
            grandTotal += subTotal;
            }
        }else{
          return res.redirect('/cart')
        }
        const coupons = await couponCollection.find({ status: { $ne: 'Inactive' } });
        res.render('shop-checkout', {userSession, userCart, userAddress, grandTotal, cartLength, user, coupons});
  }catch(error){
    next(error);
  }
}

