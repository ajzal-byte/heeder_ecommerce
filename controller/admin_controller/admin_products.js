const productCollection = require('../../models/products_schema')
const category = require('../../models/category_schema');
const brandCollection = require('../../models/brand_schema')
const multer = require('../../middleware/multer');
const path = require('path');
const sharp = require('sharp')
const fs = require('fs');



//get product page
module.exports.getProducts = async (req, res)=>{
  try{
      const products = await productCollection.find().sort({updatedAt: -1})
      res.render('products_grid', {products});
  }catch (error) {
    console.error(error);
  }
}


//get add product page
module.exports.getAddProduct = async (req, res)=>{
  try{
    const categories = await category.find();
    const brands = await brandCollection.find();
      res.render('product_add', {categories, brands});
  }catch (error) {
    console.error(error);
  }
}


//post add product
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

      productImages.push({
        fileName: filename,
        originalname: file.originalname,
        path: `/uploads/${filename}`, 
      });
  
    }

    const productCategory = await category.findOne({ categoryName: product_cat });
    const productBrand = await brandCollection.findOne({brandName: product_brand});
     
    await productCollection.create({
      productName : product_name,
      description : product_desc,
      brand : productBrand._id,
      category : productCategory._id,
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

//block product
module.exports.blockProduct = async (req, res)=>{
  try{
    const product_id = req.params.product_id;
    await productCollection.findByIdAndUpdate(product_id, {status: 'Inactive'});
    res.redirect('/admin/products')
  }catch (error) {
    console.error(error);
  }
}


//unblock product
module.exports.unblockProduct = async (req, res)=>{
  try{
    const product_id = req.params.product_id;
    await productCollection.findByIdAndUpdate(product_id, {status: 'Active'});
    res.redirect('/admin/products')
  }catch (error) {
    console.error(error);
  }
}



//view edit product page
module.exports.editProduct = async (req, res)=>{
  try{
    const product_id = req.params.product_id;
  const product_edit = await productCollection.findById(product_id).populate({path:'category', model:'Categories'}).populate({path:'brand', model: 'brandCollection'})
  const categories = await category.find();
  const brands = await brandCollection.find();
  res.render('edit_product', {product_edit, categories, brands})
  }catch (error) {
    console.error(error);
  }
}

//post edit product
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

      if (!productImages || productImages.length === 0) {
        return res.status(200).json('Product must have at least one image');
      }

      const productCategory = await category.findOne({ categoryName: product_cat });
      const productBrand = await brandCollection.findOne({brandName: product_brand});

    await productCollection.findByIdAndUpdate(product_id, {
      productName : product_name,
      description : product_desc,
      brand : productBrand._id,
      category : productCategory._id,
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


//delete image
module.exports.deleteImage = async(req, res)=>{
try{
  const productId = req.query.productId;
  const imagePath = req.query.image;
  console.log(imagePath)
  console.log("deleting image", imagePath);
  await productCollection.updateOne({_id: productId},  { $pull: { productImage: { path: imagePath } } } )
  const product_edit = await productCollection.findById(productId);
  const categories = await category.find();   
  const brands = await brandCollection.find();
  res.render('edit_product', {product_edit, categories, brands} );
}catch(error){
  console.error(error);
}
}


