const cartCollection = require('../../models/cart_schema');
const productCollection = require('../../models/products_schema');
const userCollection = require('../../models/user_schema');



module.exports.getCart = async (req, res)=>{
  try{
    const userSession = req.session.user;
    const cart = await cartCollection.find
    if(userSession){
      res.render('shop_cart', {userSession, cart});
    }else{
      res.redirect('/login')
    }
  }catch(error){
    console.error(error);
  }
}


module.exports.addtoCart = async (req, res)=>{
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
          console.log('quantity updation');
          let productItem = userCart.products[productIndex];
          productItem.quantity += 1;
          userCart.products[productIndex] = productItem;
        }else{
          console.log('product addition');
          userCart.products.push({productId: product._id, quantity:1})
        }
          // Save the changes to the database
          await userCart.save();
      }else{
        console.log(user._id);
        console.log('cart creation');
          await cartCollection.create({
          userId: user._id, 
          products:[{productId: product._id, quantity:1}]})
      }
      res.status(200).json({message: "Item Added to Cart"})

    }else{
      console.log('not logged in')
      res.status(200).json({ error: "User not logged in" });
    }
    
  }catch(error){
    console.error(error);
  }
}