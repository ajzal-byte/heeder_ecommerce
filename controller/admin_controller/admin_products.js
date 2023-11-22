const productCollection = require('../../models/products_schema')
const category = require('../../models/category_schema');
const multer = require('../../middleware/multer');
const path = require('path');
const sharp = require('sharp')
const fs = require('fs');
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
  
    const {product_name, product_desc, product_brand,product_cat,product_colour,product_factor,product_connect,product_reg_price,product_sale_price,product_stock,product_status} = req.body

    const productImages = [];


    for(const file of req.files){
      const filename = `cropped_${file.filename}`;
      let imagePath = `public/uploads/${filename}`;     
       await sharp(file.path)
      .resize({width: 785, height:750, fit:'cover'})
      .toFile(imagePath); 

      // imagePath =  `/${imagePath.split('/').slice(1).join('/')}`
      // console.log(imagePath)

      productImages.push({
        fileName: filename,
        originalname: file.originalname,
        path: `/uploads/${filename}`, 
      });
  
    }

     
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
    // const products = await productCollection.find()
    res.redirect('/admin/products');
    
  
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



//view edit product page
module.exports.editProduct = async (req, res)=>{
  try{
    const product_id = req.params.product_id;
  const product_edit = await productCollection.findById(product_id);
  const categories = await category.find();
  res.render('edit_product', {product_edit, categories})
  }catch (error) {
    console.error(error);
  }
}

module.exports.updateProduct = async (req, res)=>{
  try{
    const product_id = req.params.product_id;
    const {product_name, product_desc, product_brand,product_cat,product_colour,product_factor,
    product_connect,product_reg_price,product_sale_price,product_stock,product_status} = req.body
    
      // Retrieve existing product data
      const existingProduct = await productCollection.findById(product_id);

      // console.log(existingProduct.productImage)
      // Check if new images were uploaded
    let productImages = existingProduct.productImage;
    if (req.files && req.files.length > 0) {
      // Process and add new images
      for (const file of req.files) {
        const filename = `cropped_${file.filename}`;
        const imagePath = `public/uploads/${filename}`;

        // Resize and save the cropped image
        await sharp(file.path)
          .resize({ width: 785, height: 750, fit: 'cover' })
          .toFile(imagePath);

        productImages.push({
          fileName: filename,
          originalname: file.originalname,
          path: `/uploads/${filename}`,
        });
      }
    }  else {
        // If no new images, retain the existing images
        if (existingProduct && existingProduct.productImage) {
          productImages = existingProduct.productImage;
        }
      }

    await productCollection.findByIdAndUpdate(product_id, {
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
    res.redirect('/admin/products');
  }catch (error) {
    console.error(error);
  }
}

module.exports.deleteImage = async(req, res)=>{
try{
  const productId = req.query.productId;
  const imagePath = req.query.image;
  console.log(imagePath)
  console.log("deleting image", imagePath);
  await productCollection.updateOne({_id: productId},  { $pull: { productImage: { path: imagePath } } } )
  const product_edit = await productCollection.findById(productId);
  const categories = await category.find();   
  res.render('edit_product', {product_edit, categories} );
}catch(error){
  console.error(error);
}
}


