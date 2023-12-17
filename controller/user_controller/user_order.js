const addressCollection = require("../../models/address_schema");
const cartCollection = require("../../models/cart_schema");
const userCollection = require("../../models/user_schema");
const orderCollection = require('../../models/orders_schema');
const productCollection = require("../../models/products_schema");



module.exports.viewOrders = async (req, res, next)=>{
  try{
    const orderId = req.query.orderId;
    const userSession = req.session.user;
    let cartLength;
    let user;
    
    if(userSession){
      user = await userCollection.findOne({email: userSession.email})
      cartLength = await cartCollection.findOne({userId: user._id});
      if (cartLength && cartLength.products) {
        // Check if the cart and its products for the user exists
        cartLength = cartLength.products.length;
      }
    }
    // const userDetails = await userCollection.findOne({email: userSession.email});
    const orderDetails = await orderCollection.findOne({_id: orderId})
    .populate({path: 'products.productId', model: 'Product'});
    let expiryDate = orderDetails.orderDate;
    expiryDate.setDate(expiryDate.getDate() + 1);
    res.render('view-order', {userSession, orderDetails, cartLength, user, expiryDate});
  }catch(error){
    next(error);
  }
  }

module.exports.getOrderPlacedCod = async (req, res, next)=>{
try{
  let totalAmount = 0;
  const userSession = req.session.user;
  const user = await userCollection.findOne({email: userSession.email});
  const userAddress = await addressCollection.findOne({"address._id": req.query.addressId}, { "address.$": 1 });
  const userCart = await cartCollection.findOne(
    {userId: user._id}).populate({path: 'products.productId', model:'Product', populate:{path: 'brand', model: 'brandCollection'}});

  userCart.products.forEach(product=>{
    if(product.quantity > product.productId.stock || product.productId.stock == 0){
      return res.redirect('/cart');
    }
  });

  const productArray = [];
  userCart.products.forEach(product => {
      productArray.push({
        productId: product.productId._id,
        price: product.productId.salePrice,
        quantity: product.quantity
      })

    });
    
userCart.products.forEach(product=>{
 totalAmount += product.quantity * product.productId.salePrice;
})

  const paymentMethod = "Cash on Delivery"
  //order creation
  await orderCollection.create({
    userId: user._id, 
    products: productArray,
    totalAmount, 
    paymentMethod,
    address: userAddress,
  })

  //cart removal
    for (const product of userCart.products){
      await productCollection.updateOne(
        {_id : product.productId._id},
        {$inc: {stock: -product.quantity}}
        );
    }
    await cartCollection.deleteOne({userId: user._id});
    res.render('order-placed', {userSession});
  
}catch(error){
  next(error);
}
}


module.exports.cancelOrder = async (req, res, next)=>{
  try{
    const orderId = req.params.orderId;
    await orderCollection.findByIdAndUpdate(orderId, {orderStatus: 'Cancelled', paymentStatus: 'Failed'});
    res.redirect(`/view-order/?orderId=${orderId}`);
  }catch (error) {
    next(error);
  }
}