const userCollection = require('../../models/user_schema');
const productCollection = require('../../models/products_schema')
const cartCollection = require('../../models/cart_schema')

//home page
module.exports.getHomePage = async(req, res, next)=>{
  try{
    const products = await productCollection.find().populate({path:'category', model:'Categories'})
    .sort({updatedAt: -1}).limit(6);
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
    res.render('user_index', {products, userSession, cartLength, user});
  }catch(error){
    next(error);
  }
  };

module.exports.getProducts = async (req, res)=>{
try{
  const products = await productCollection.find().populate({path:'category', model:'Categories'})
  .sort({updatedAt: -1})
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
  console.log(user);
  res.render('products-page', {products, userSession, cartLength, user});
}catch(error){
  next(error);
}
}

//single product page
module.exports.getProductDetails = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    const product_id = req.params.product_id;
    const product_details = await productCollection.findOne({_id : product_id}).populate({path:'category', model:'Categories'}).populate({path:'brand', model: 'brandCollection'})
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
    res.render('product_view', {product_details, userSession, cartLength, user});
  }catch(error){
    next(error);
  }
};

  