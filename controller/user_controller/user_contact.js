const userCollection = require('../../models/user_schema');
const cartCollection = require('../../models/cart_schema');

module.exports.getContactPage = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    let cartLength;
    let user;
    if(userSession){
      user = await userCollection.findOne({email: userSession.email});
      cartLength = await cartCollection.findOne({userId: user._id});
      if (cartLength && cartLength.products) {
        // Check if the cart and its products for the user exists
        cartLength = cartLength.products.length;
      }
    }
    // const userDetails = await userCollection.findOne({email: userSession.email});
    res.render('page-contact', {cartLength, userSession, user});
  }catch(error){
    next(error);
  }
}