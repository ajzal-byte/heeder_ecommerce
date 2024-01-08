const wishlistCollection = require('../../models/whishlist_schema');
const productCollection = require('../../models/products_schema');
const userCollection = require('../../models/user_schema');
const cartCollection = require('../../models/cart_schema');

const getWishlist = async (req, res, next)=>{
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
      const userWishlist = await wishlistCollection
      .findOne({userId: user._id}).populate({path:'products.productId', model:'Product', populate: {path:'brand', model: 'brandCollection'}});
      res.render('whishlist', {userSession, userWishlist, cartLength, user});
}catch(error){
  next(error)
}
}

const addToWishlist = async (req, res, next)=>{
try{
  const userSession = req.session.user
  if(userSession){
    const productId = req.query.productId;
    const product = await productCollection.findById(productId);
    const user = await userCollection.findOne({email: userSession.email});
    const userWishlist = await wishlistCollection.findOne({userId: user._id});
    // if user has a wishlist
    if(userWishlist){
      let productIndex = userWishlist.products.findIndex(p => p.productId == productId)
      //if product exists
      if(productIndex > -1){
        return res.status(200).json({ error: "Product already exists in the wishlist" });
      }else{
        userWishlist.products.push({productId: product._id})
      }
        // Save the changes to the database
        await userWishlist.save();
    }else{
        await wishlistCollection.create({
        userId: user._id, 
        products:[{productId: product._id}]})
    }
    res.status(200).json({message: "Item Added to Wishlist"})

  }else{
    res.status(200).json({ error: "User not logged in" });
  }
}catch(error){
  next(error)
}
}

const removeFromWishlist = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    const user = await userCollection.findOne({email: userSession.email});
    const productId = req.query.productId;
    await wishlistCollection.findOneAndUpdate(
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

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
}