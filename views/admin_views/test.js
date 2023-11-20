module.exports.updateProduct = async (req, res) => {
  try {
    const product_id = req.params.product_id;
    const {
      product_name,
      product_desc,
      product_brand,
      product_cat,
      product_colour,
      product_factor,
      product_connect,
      product_reg_price,
      product_sale_price,
      product_stock,
      product_status,
    } = req.body;

    let productImages = [];

    // Check if new images were uploaded
    if (req.files) {
      productImages = req.files.map((file) => ({
        fileName: file.filename,
        originalname: file.originalname,
        path: path.join('/uploads', file.filename), // Adjust the path as needed
      }));
    } else {
      // If no new images, retain the existing images
      const existingProduct = await productCollection.findById(product_id);
      if (existingProduct && existingProduct.productImage) {
        productImages = existingProduct.productImage;
      }
    }

    console.log(req.body);

    await productCollection.findByIdAndUpdate(product_id, {
      productName: product_name,
      description: product_desc,
      brand: product_brand,
      category: product_cat,
      colour: product_colour,
      formfactor: product_factor,
      connectivity: product_connect,
      regularPrice: product_reg_price,
      salePrice: product_sale_price,
      stock: product_stock,
      status: product_status,
      productImage: productImages,
    });

    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
