const addressCollection = require("../../models/address_schema");
const cartCollection = require("../../models/cart_schema");
const userCollection = require("../../models/user_schema");
const orderCollection = require('../../models/orders_schema');
const productCollection = require("../../models/products_schema");



module.exports.getOrderPlacedCod = async (req, res)=>{
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
    console.log({
      productId: product.productId._id,
      price: product.productId.salePrice,
      quantity: product.quantity
    });
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
  console.error(error)
}
}


module.exports.cancelOrder = async (req, res)=>{
  
}