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
    console.log(userSession);
    if(userSession){
      // console.log(userSession);
      // console.log(req.session.user);
      const productID = req.query.productID;
      const product = await productCollection.findById(productID);
      const user = await userCollection.findOne({email: userSession.email});
      const userCart = await cartCollection.findOne({userID: user._id}) 
      // if user has a cart
      if(userCart){
        let productIndex = userCart.products.findIndex(p => p.productID == productID)
        //if product exists
        if(productIndex > -1){
          let productItem = userCart.products[productIndex];
          productItem.quantity += 1;
          userCart.products[productIndex] = productItem;
        }else{
          userCart.products.push({productID, quantity})
        }
      }

    }else{
      console.log(userSession);
      console.log('Redirecting to /login'); 
      res.redirect('/login')
    }
    
  }catch(error){
    console.error(error);
  }
}