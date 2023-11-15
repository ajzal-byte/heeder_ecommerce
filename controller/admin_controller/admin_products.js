const productCollection = require('../../models/products_schema')
const category = require('../../models/category_schema');
const multer = require('../../middleware/multer');
const path = require('path');
// const upload = require('../../middleware/multer');




module.exports.getProducts = async (req, res)=>{
  try{
    if(req.session.admin){
      const products = await productCollection.find()
      res.render('products_grid', {products});
    }else{
      res.redirect('/admin');
    }
  }catch (error) {
    console.error(error);
  }
}

module.exports.getAddProduct = async (req, res)=>{
  try{
    if(req.session.admin){
    const categories = await category.find();
      res.render('product_add', {categories});
    }else{
      res.redirect('/admin')
    }
  }catch (error) {
    console.error(error);
  }
}

module.exports.postAddProduct = async (req, res)=>{
  try{
    const ifExist = await productCollection.findOne({productName : req.body.product_name})
    const categories = await category.find();
    if(ifExist){
  res.render('product_add', {message: "Product already exists", categories});
  }else{
  
    const {product_name, product_desc, product_brand,product_cat,product_colour,product_factor,product_connect,product_reg_price,product_sale_price,product_stock,product_status} = req.body

    const productImages = req.files.map((file) => ({
      fileName: file.filename,
      originalname: file.originalname,
      path: path.join('/uploads', file.filename), // Adjust the path as needed
    }));

    await productCollection.create({
      productName : product_name,
      description : product_desc,
      brand : product_brand,
      category : product_cat,
      colour : product_colour,
      formfactor : product_factor,
      connectivity : product_connect,
      regularPrice : product_reg_price,
      salePrice : product_sale_price,
      stock : product_stock,
      status : product_status,
      productImage: productImages,
    });
    const products = await productCollection.find()
    res.render('products_grid', {products});
    }
  
  }catch (error) {
    console.error(error);
  }
}

module.exports.blockProduct = async (req, res)=>{
  try{
    const product_id = req.params.product_id;
    await productCollection.findByIdAndUpdate(product_id, {status: 'Inactive'});
    const products = await productCollection.find()
    res.render('products_grid', {products});
  }catch (error) {
    console.error(error);
  }
}

module.exports.unblockProduct = async (req, res)=>{
  try{
    const product_id = req.params.product_id;
    await productCollection.findByIdAndUpdate(product_id, {status: 'Active'});
    const products = await productCollection.find()
    res.render('products_grid', {products});
  }catch (error) {
    console.error(error);
  }
}


