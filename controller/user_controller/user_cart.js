const cartCollection = require('../../models/cart_schema');
const productCollection = require('../../models/products_schema');
const userCollection = require('../../models/user_schema');


module.exports.getCart = async (req, res, next)=>{
  try{
      const userSession = req.session.user;
      let cartLength;
      if(userSession){
        const user = await userCollection.findOne({email: userSession.email});
        cartLength = await cartCollection.findOne({userId: user._id});
        if (cartLength && cartLength.products) {
          // Check if the cart and its products for the user exists
          cartLength = cartLength.products.length;
        }
      }
      const user = await userCollection.findOne({email: userSession.email});
      const userCart = await cartCollection
      .findOne({userId: user._id}).populate({path:'products.productId', model:'Product', populate: {path:'brand', model: 'brandCollection'}});
      res.render('shop_cart', {userSession, userCart, cartLength, user});

  }catch(error){
    next(error);
  }
}

module.exports.addtoCart = async (req, res, next)=>{
  try{
    const userSession = req.session.user
    if(userSession){
      const productId = req.query.productId;
      const product = await productCollection.findById(productId);
      const user = await userCollection.findOne({email: userSession.email});
      const userCart = await cartCollection.findOne({userId: user._id});
      // if user has a cart
      if(userCart){
        let productIndex = userCart.products.findIndex(p => p.productId == productId)
        //if product exists
        if(productIndex > -1){
          let productItem = userCart.products[productIndex];
          productItem.quantity += 1;
          userCart.products[productIndex] = productItem;
        }else{
          userCart.products.push({productId: product._id, quantity:1})
        }
          // Save the changes to the database
          await userCart.save();
      }else{
          await cartCollection.create({
          userId: user._id, 
          products:[{productId: product._id, quantity:1}]})
      }
      res.status(200).json({message: "Item Added to Cart"})

    }else{
      res.status(200).json({ error: "User not logged in" });
    }
    
  }catch(error){
    next(error);
  }
}

module.exports.updateCart = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    const user = await userCollection.findOne({email: userSession.email});
    const productId = req.body.productId;
    const quantity = req.body.quantity; 
     await cartCollection.updateOne({
      userId: user._id,
      'products.productId': productId
    },
    {
      $set:{
        'products.$.quantity': quantity,
      }
    }
    );
    const cart = await cartCollection.findOne({
      userId: user._id
    }).populate({path: 'products.productId', model: 'Product'})
     // Find the updated product in the cart
    const updatedProduct = cart.products.find(product => product.productId._id.toString() === productId.toString());
    let subTotal = 0;
    if (updatedProduct.productId.offerStatus == 'Active' && updatedProduct.productId.endDate > Date.now()) {
      let discountPrice = updatedProduct.productId.salePrice * updatedProduct.productId.discountPercentage / 100 * updatedProduct.quantity;
      subTotal = updatedProduct.productId.salePrice * updatedProduct.quantity - discountPrice;
    } else {
      subTotal = updatedProduct.productId.salePrice * updatedProduct.quantity;
    }
    const stock = updatedProduct.productId.stock
    return res.status(200).json({newQuantity: updatedProduct.quantity, subTotal, stock})

  }catch(error){
    next(error);
  }
}

module.exports.removeCart = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    const user = await userCollection.findOne({email: userSession.email});
    console.log(user);
    const productId = req.query.productId;
    console.log(productId);
    await cartCollection.findOneAndUpdate(
      {
        userId: user._id,
        'products.productId': productId,
      },
      {
        $pull: {
          'products': { productId: productId },
        },
      }
    );

    res.status(200).json({success: true})

  }catch(error){
    next(error);
  }
}
