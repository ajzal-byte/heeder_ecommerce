const userCollection = require('../../models/user_schema');
const productCollection = require('../../models/products_schema');
const cartCollection = require('../../models/cart_schema');
const categoryCollection = require('../../models/category_schema');

//home page
module.exports.getHomePage = async(req, res, next)=>{
  try{
    const products = await productCollection.find({ status: { $ne: 'Inactive' } }).populate({ path: 'category', model: 'Categories' })
    .sort({ updatedAt: -1 }).limit(6);
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

//all products page
module.exports.getProducts = async (req, res)=>{
try{
  let perPage = 6;
  let page = req.query.page || 1;
  const products = await productCollection.find({ status: { $ne: 'Inactive' } }).populate({path:'category', model:'Categories'})
  .sort({updatedAt: -1})
  .skip(perPage * page - perPage)
  .limit(perPage)
  const categories = await categoryCollection.find({isListed:"Active"});
  const totalProducts = await productCollection.countDocuments();
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
  res.render('products-page', {
    products, 
    categories,
    userSession, 
    cartLength, 
    user, 
    current: page,
    pagination: true,
    totalPages: Math.ceil(totalProducts / perPage)});
}catch(error){
  next(error);
}
}

//single product page
module.exports.getProductDetails = async (req, res, next)=>{
  try{
    const userSession = req.session.user;
    const product_id = req.params.product_id;
    const product_details = await productCollection.findOne({_id : product_id})
    .populate({path:'category', model:'Categories'}).populate({path:'brand', model: 'brandCollection'});
    const relatedProducts = await productCollection.find({
      'category': product_details.category, 
      _id: { $ne: product_id }
    }).populate({path:'brand', model: 'brandCollection'});
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
    res.render('product_view', {product_details, userSession, cartLength, user, relatedProducts});
  }catch(error){
    next(error);
  }
};

//search product
module.exports.searchProduct = async (req, res, next)=>{
  try{
  let perPage = 6;
  let page = req.query.page || 1;
  const searchInput = req.query.searchInput || "";
  const regexPattern = new RegExp(searchInput, 'i');
  const products = await productCollection.find({
    $and: [
      { productName: { $regex: regexPattern } },
      { status: 'Active' }, 
    ],
  })
  .sort({updatedAt: -1})
  .skip(perPage * page - perPage)
  .limit(perPage)
  .exec() 
  
  const categories = await categoryCollection.find({isListed:"Active"});
  const totalProducts = await productCollection.countDocuments({
    $and: [
        { productName: { $regex: regexPattern } },
        { status: 'Active' },
    ],
  });
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
  res.render('products-page', {
    products, 
    categories,
    userSession, 
    cartLength, 
    user, 
    current: page,
    pagination: true,
    totalPages: Math.ceil(totalProducts / perPage)});

 
  }catch(error){
    next(error)
  }
}
  
//filter products
module.exports.filterProduct = async (req, res, next)=>{
try{
  let products = [];
  const categoryId = req.query.categoryId;
  const sort = req.query.sort;
  const categories = await categoryCollection.find({isListed:"Active"});
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

  if (categoryId && sort) {
    products = await productCollection.find({
        status: { $ne: 'Inactive' },
        category: categoryId
    }).sort({ salePrice: parseFloat(sort) }).populate({ path: 'category', model: 'Categories' });
    console.log('category and sort');
} else if (categoryId && !sort) {
    products = await productCollection.find({
        status: { $ne: 'Inactive' },
        category: categoryId
    }).populate({ path: 'category', model: 'Categories' });
    console.log('category only');
} else if (!categoryId && sort) {
    products = await productCollection.find({ status: { $ne: 'Inactive' } }).sort({ salePrice: parseFloat(sort) }).populate({ path: 'category', model: 'Categories' });
    console.log('sort only');
} else {
    products = await productCollection.find({ status: { $ne: 'Inactive' } }).populate({ path: 'category', model: 'Categories' });
    console.log('none');
}
  const totalProducts = products.length;
  console.log(products);
  res.render('products-page', {
    products, 
    categories,
    userSession, 
    cartLength, 
    user, 
    pagination: false,
  });
}catch(error){
    next(error);
  }
}
